import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { S3Service } from '../files/services/s3.service';

/**
 * Projects service
 * Handles all project-related business logic and database operations
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Create a new project
   */
  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    try {
      // Check if project with same name already exists
      const existingProject = await this.projectModel.findOne({
        projectName: createProjectDto.projectName,
        isActive: true,
      });

      if (existingProject) {
        throw new ConflictException('Project with this name already exists');
      }

      // Create new project
      const createdProject = new this.projectModel({
        ...createProjectDto,
        possessionDate: createProjectDto.possessionDate ? new Date(createProjectDto.possessionDate) : undefined,
      });

      return await createdProject.save();
    } catch (error) {
      console.error('Error in ProjectsService.create:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create project');
    }
  }

  /**
   * Find all projects with pagination and filtering
   */
  async findAll(queryDto: QueryProjectDto) {
    try {
      const {
        page,
        limit,
        search,
        projectStatus,
        propertyType,
        city,
        state,
        builder,
        priceMin,
        priceMax,
        bedroomsMin,
        bedroomsMax,
        unitType,
        isActive,
        isFeatured,
        approvalStatus,
        amenities,
        tags,
        sortBy,
        sortOrder,
        latitude,
        longitude,
        radius,
      } = queryDto;

      // Build filter object
      const filter: any = {};

      if (search) {
        filter.$or = [
          { projectName: { $regex: search, $options: 'i' } },
          { projectDescription: { $regex: search, $options: 'i' } },
          { 'builder.name': { $regex: search, $options: 'i' } },
        ];
      }

      if (projectStatus) {
        filter.projectStatus = projectStatus;
      }

      if (propertyType) {
        filter.propertyType = propertyType;
      }

      if (city) {
        filter['location.city'] = { $regex: city, $options: 'i' };
      }

      if (state) {
        filter['location.state'] = { $regex: state, $options: 'i' };
      }

      if (builder) {
        filter['builder.name'] = { $regex: builder, $options: 'i' };
      }

      if (priceMin !== undefined || priceMax !== undefined) {
        filter.$or = filter.$or || [];
        const priceFilter: any = {};
        if (priceMin !== undefined) priceFilter.$gte = priceMin;
        if (priceMax !== undefined) priceFilter.$lte = priceMax;

        filter.$or.push(
          { priceMin: priceFilter },
          { priceMax: priceFilter },
          { 'unitConfigurations.priceMin': priceFilter },
          { 'unitConfigurations.priceMax': priceFilter }
        );
      }

      if (bedroomsMin !== undefined || bedroomsMax !== undefined) {
        const bedroomFilter: any = {};
        if (bedroomsMin !== undefined) bedroomFilter.$gte = bedroomsMin;
        if (bedroomsMax !== undefined) bedroomFilter.$lte = bedroomsMax;
        filter['unitConfigurations.bedrooms'] = bedroomFilter;
      }

      if (unitType) {
        filter['unitConfigurations.type'] = unitType;
      }

      if (typeof isActive === 'boolean') {
        filter.isActive = isActive;
      }

      if (typeof isFeatured === 'boolean') {
        filter.isFeatured = isFeatured;
      }

      if (approvalStatus) {
        filter.approvalStatus = approvalStatus;
      }

      if (amenities) {
        const amenityList = amenities.split(',').map(a => a.trim());
        filter.$or = filter.$or || [];
        amenityList.forEach(amenity => {
          filter.$or.push(
            { 'amenities.basic': { $regex: amenity, $options: 'i' } },
            { 'amenities.security': { $regex: amenity, $options: 'i' } },
            { 'amenities.recreational': { $regex: amenity, $options: 'i' } },
            { 'amenities.convenience': { $regex: amenity, $options: 'i' } },
            { 'amenities.connectivity': { $regex: amenity, $options: 'i' } }
          );
        });
      }

      if (tags) {
        const tagList = tags.split(',').map(t => t.trim());
        filter.tags = { $in: tagList };
      }

      // Location-based search
      if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
        filter['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius * 1000, // Convert km to meters
          },
        };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [projects, total] = await Promise.all([
        this.projectModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.projectModel.countDocuments(filter),
      ]);

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Error in ProjectsService.findAll:', error);
      throw new BadRequestException('Failed to fetch projects');
    }
  }

  /**
   * Find project by ID
   */
  async findById(id: string): Promise<Project> {
    try {
      const project = await this.projectModel
        .findById(id)
        .exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Increment view count
      await this.projectModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

      return project;
    } catch (error) {
      console.error('Error in ProjectsService.findById:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid project ID');
    }
  }

  /**
   * Update project by ID
   */
  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    try {
      const updateData = {
        ...updateProjectDto,
        possessionDate: updateProjectDto.possessionDate ? new Date(updateProjectDto.possessionDate) : undefined,
      };

      const project = await this.projectModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return project;
    } catch (error) {
      console.error('Error in ProjectsService.update:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update project');
    }
  }

  /**
   * Delete project by ID (soft delete)
   */
  async remove(id: string): Promise<void> {
    try {
      const project = await this.projectModel
        .findByIdAndUpdate(id, { isActive: false, updatedAt: new Date() }, { new: true })
        .exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }
    } catch (error) {
      console.error('Error in ProjectsService.remove:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete project');
    }
  }

  /**
   * Upload project media files to S3
   */
  async uploadMedia(
    projectId: string,
    files: Express.Multer.File[],
    mediaType: 'images' | 'videos' | 'brochures' | 'floorPlans' | 'masterPlan' | 'locationMap',
    userId: string
  ): Promise<string[]> {
    try {
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const uploadPromises = files.map(file =>
        this.s3Service.uploadFile(file, `projects/${projectId}/${mediaType}`, false)
      );

      const uploadResults = await Promise.all(uploadPromises);
      const urls = uploadResults.map(result => result.url);

      // Update project with new media URLs
      const updatePath = `media.${mediaType}`;
      await this.projectModel.findByIdAndUpdate(
        projectId,
        {
          $push: { [updatePath]: { $each: urls } },
        }
      );

      return urls;
    } catch (error) {
      console.error('Error in ProjectsService.uploadMedia:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload media files');
    }
  }

  /**
   * Upload project documents to S3
   */
  async uploadDocuments(
    projectId: string,
    files: Express.Multer.File[],
    documentType: 'approvals' | 'legalDocuments' | 'certificates' | 'others',
    userId: string
  ): Promise<string[]> {
    try {
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const uploadPromises = files.map(file =>
        this.s3Service.uploadFile(file, `projects/${projectId}/documents/${documentType}`, false)
      );

      const uploadResults = await Promise.all(uploadPromises);
      const urls = uploadResults.map(result => result.url);

      // Update project with new document URLs
      const updatePath = `documents.${documentType}`;
      await this.projectModel.findByIdAndUpdate(
        projectId,
        {
          $push: { [updatePath]: { $each: urls } },
        }
      );

      return urls;
    } catch (error) {
      console.error('Error in ProjectsService.uploadDocuments:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload document files');
    }
  }

  /**
   * Get project statistics
   */
  async getStatistics() {
    try {
      const [
        totalProjects,
        activeProjects,
        inactiveProjects,
        featuredProjects,
        statusStats,
        propertyTypeStats,
        cityStats,
      ] = await Promise.all([
        this.projectModel.countDocuments(),
        this.projectModel.countDocuments({ isActive: true }),
        this.projectModel.countDocuments({ isActive: false }),
        this.projectModel.countDocuments({ isFeatured: true }),
        this.projectModel.aggregate([
          { $group: { _id: '$projectStatus', count: { $sum: 1 } } },
        ]),
        this.projectModel.aggregate([
          { $group: { _id: '$propertyType', count: { $sum: 1 } } },
        ]),
        this.projectModel.aggregate([
          { $group: { _id: '$location.city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

      return {
        totalProjects,
        activeProjects,
        inactiveProjects,
        featuredProjects,
        statusDistribution: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        propertyTypeDistribution: propertyTypeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        topCities: cityStats,
      };
    } catch (error) {
      console.error('Error in ProjectsService.getStatistics:', error);
      throw new BadRequestException('Failed to get project statistics');
    }
  }

  async getFeaturedProjects(limit: number = 10) {
    try {
      return this.projectModel
        .find({ isFeatured: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('Error in ProjectsService.getFeaturedProjects:', error);
      throw new BadRequestException('Failed to get featured projects');
    }
  }
}