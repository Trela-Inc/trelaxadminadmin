import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity, AmenityDocument } from './schemas/amenity.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType, AmenityCategory } from '../common/enums/master-types.enum';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { QueryMasterWithCategoryDto } from '../common/dto/query-master.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

/**
 * Amenities Service
 * Handles CRUD operations for amenity master data
 */
@Injectable()
export class AmenitiesService extends BaseMasterService<Amenity> {
  constructor(
    @InjectModel(Amenity.name) private amenityModel: Model<AmenityDocument>
  ) {
    super(amenityModel, MasterType.AMENITY);
  }

  /**
   * Create a new amenity
   */
  async createAmenity(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    return await this.create(createAmenityDto);
  }

  /**
   * Find all amenities with advanced filtering
   */
  async findAllAmenities(queryDto: QueryMasterWithCategoryDto = {}): Promise<MasterListResponse<Amenity>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        isDefault,
        isPopular,
        sortBy = 'sortOrder',
        sortOrder = 'asc',
        category
      } = queryDto;

      // Build filter object
      const filter: any = { 
        masterType: MasterType.AMENITY,
        status: { $ne: 'archived' }
      };

      // Basic filters
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
          { keywords: { $regex: search, $options: 'i' } },
          { relatedAmenities: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) filter.status = status;
      if (typeof isDefault === 'boolean') filter.isDefault = isDefault;
      if (typeof isPopular === 'boolean') filter.isPopular = isPopular;
      if (category) filter.category = category;

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [data, total] = await Promise.all([
        this.amenityModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.amenityModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as Amenity[],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch amenities: ${error.message}`);
    }
  }

  /**
   * Find amenity by ID
   */
  async findAmenityById(id: string): Promise<Amenity> {
    return await this.findById(id);
  }

  /**
   * Update amenity by ID
   */
  async updateAmenity(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity> {
    return await this.update(id, updateAmenityDto);
  }

  /**
   * Delete amenity by ID
   */
  async removeAmenity(id: string): Promise<void> {
    return await this.remove(id);
  }

  /**
   * Find amenities by category
   */
  async findAmenitiesByCategory(category: AmenityCategory): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          category,
          masterType: MasterType.AMENITY,
          status: { $ne: 'archived' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch amenities by category: ${error.message}`);
    }
  }

  /**
   * Find popular amenities
   */
  async findPopularAmenities(limit: number = 10): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          isPopular: true,
          masterType: MasterType.AMENITY,
          status: 'active'
        })
        .sort({ popularityScore: -1, sortOrder: 1, name: 1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch popular amenities: ${error.message}`);
    }
  }

  /**
   * Find amenities by importance level
   */
  async findAmenitiesByImportance(importanceLevel: number): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          importanceLevel,
          masterType: MasterType.AMENITY,
          status: { $ne: 'archived' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch amenities by importance: ${error.message}`);
    }
  }

  /**
   * Find amenities for residential projects
   */
  async findResidentialAmenities(): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          'availability.residential': true,
          masterType: MasterType.AMENITY,
          status: 'active'
        })
        .sort({ popularityScore: -1, sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch residential amenities: ${error.message}`);
    }
  }

  /**
   * Find amenities for commercial projects
   */
  async findCommercialAmenities(): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          'availability.commercial': true,
          masterType: MasterType.AMENITY,
          status: 'active'
        })
        .sort({ popularityScore: -1, sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch commercial amenities: ${error.message}`);
    }
  }

  /**
   * Find luxury amenities
   */
  async findLuxuryAmenities(): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          'availability.luxury': true,
          masterType: MasterType.AMENITY,
          status: 'active'
        })
        .sort({ popularityScore: -1, sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch luxury amenities: ${error.message}`);
    }
  }

  /**
   * Find basic amenities
   */
  async findBasicAmenities(): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          'availability.basic': true,
          masterType: MasterType.AMENITY,
          status: 'active'
        })
        .sort({ importanceLevel: -1, sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch basic amenities: ${error.message}`);
    }
  }

  /**
   * Search amenities by tags
   */
  async searchAmenitiesByTags(tags: string[]): Promise<Amenity[]> {
    try {
      return await this.amenityModel
        .find({ 
          tags: { $in: tags },
          masterType: MasterType.AMENITY,
          status: { $ne: 'archived' }
        })
        .sort({ popularityScore: -1, sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to search amenities by tags: ${error.message}`);
    }
  }

  /**
   * Get amenity statistics
   */
  async getAmenityStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      // Additional amenity-specific statistics
      const [
        categoryStats,
        importanceStats,
        availabilityStats,
        topPopularAmenities,
        averagePopularityScore
      ] = await Promise.all([
        this.amenityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.AMENITY,
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.amenityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.AMENITY,
              status: { $ne: 'archived' },
              importanceLevel: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$importanceLevel', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),
        this.amenityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.AMENITY,
              status: { $ne: 'archived' }
            }
          },
          {
            $group: {
              _id: null,
              residential: { $sum: { $cond: ['$availability.residential', 1, 0] } },
              commercial: { $sum: { $cond: ['$availability.commercial', 1, 0] } },
              luxury: { $sum: { $cond: ['$availability.luxury', 1, 0] } },
              basic: { $sum: { $cond: ['$availability.basic', 1, 0] } }
            }
          }
        ]),
        this.amenityModel.find({
          masterType: MasterType.AMENITY,
          status: 'active',
          popularityScore: { $exists: true, $ne: null }
        })
        .sort({ popularityScore: -1 })
        .limit(5)
        .select('name popularityScore category'),
        this.amenityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.AMENITY,
              popularityScore: { $exists: true, $ne: null },
              status: { $ne: 'archived' }
            }
          },
          { 
            $group: { 
              _id: null, 
              avgScore: { $avg: '$popularityScore' } 
            } 
          }
        ])
      ]);

      const byCategory = categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byImportanceLevel = importanceStats.reduce((acc, item) => {
        acc[`level_${item._id}`] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        averagePopularityScore: averagePopularityScore[0]?.avgScore || 0,
        byCategory,
        byImportanceLevel,
        availability: availabilityStats[0] || {
          residential: 0,
          commercial: 0,
          luxury: 0,
          basic: 0
        },
        topPopularAmenities
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get amenity statistics: ${error.message}`);
    }
  }

  /**
   * Check if amenity is being used before deletion
   */
  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // Check if amenity is being used in projects
    // This would require injecting the ProjectsService
    // For now, we'll implement a basic check
    
    // TODO: Implement proper usage checking with other modules
    // Example:
    // const projectsUsingAmenity = await this.projectsService.countByAmenity(id);
    // if (projectsUsingAmenity > 0) {
    //   throw new BadRequestException('Cannot delete amenity as it is being used in projects');
    // }
  }
}
