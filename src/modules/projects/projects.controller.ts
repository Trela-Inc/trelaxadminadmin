import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseUtil } from '../../common/utils/response.util';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '../../common/decorators/api-response.decorator';
import { S3Service } from '../files/services/s3.service';

/**
 * Projects controller
 * Handles HTTP requests for real estate project management operations
 */
@ApiTags('🏢 Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Create a new project with media upload
   */
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '🏗️ Create New Project (with media upload)',
    description: `
**Create a new real estate project with file uploads**

This endpoint accepts both project data and file uploads in a single request:

**Form Fields:**
- **projectData**: JSON string containing all project information
- **projectImages**: Multiple image files (JPG, PNG, WebP)
- **floorPlanImages**: Multiple floor plan images
- **brochurePdf**: Single PDF brochure file
- **additionalDocuments**: Multiple document files (PDF, DOC, etc.)

**File Storage:**
- All files are uploaded to AWS S3
- Organized in folders: /projects/images/, /projects/floorplans/, /projects/brochures/, /projects/documents/
- URLs are automatically included in the project response

**Example Form Data:**
- projectData: '{"projectName": "Test Project", "projectDescription": "...", ...}'
- projectImages: [file1.jpg, file2.jpg]
- floorPlanImages: [floorplan1.jpg]
- brochurePdf: brochure.pdf
    `,
  })
  @ApiCreatedResponse({
    description: 'Project created successfully with uploaded files',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Project created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            projectName: { type: 'string', example: 'Luxury Heights Residency' },
            projectStatus: { type: 'string', example: 'under_construction' },
            media: {
              type: 'object',
              properties: {
                images: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://s3.amazonaws.com/bucket/projects/images/image1.jpg']
                },
                floorPlans: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://s3.amazonaws.com/bucket/projects/floorplans/plan1.jpg']
                },
                brochures: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://s3.amazonaws.com/bucket/projects/brochures/brochure.pdf']
                }
              }
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiBadRequestResponse('Invalid project data or file upload failed')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async create(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req: any
  ) {
    try {
      // Parse project data from form field
      let createProjectDto: CreateProjectDto;

      if (body.projectData) {
        // If projectData is sent as a form field
        createProjectDto = typeof body.projectData === 'string'
          ? JSON.parse(body.projectData)
          : body.projectData;
      } else {
        // If sent as regular form fields
        createProjectDto = body;
      }

      // Initialize media object
      const media: any = {
        images: [],
        floorPlans: [],
        brochures: [],
        videos: [],
        masterPlan: [],
        locationMap: []
      };

      const documents: any = {
        approvals: [],
        legalDocuments: [],
        certificates: [],
        others: []
      };

      // Process uploaded files
      if (files && files.length > 0) {
        for (const file of files) {
          const fieldName = file.fieldname;
          let s3Folder = 'projects/misc';
          let targetArray = documents.others;

          // Determine S3 folder and target array based on field name
          switch (fieldName) {
            case 'projectImages':
              s3Folder = 'projects/images';
              targetArray = media.images;
              break;
            case 'floorPlanImages':
              s3Folder = 'projects/floorplans';
              targetArray = media.floorPlans;
              break;
            case 'brochurePdf':
              s3Folder = 'projects/brochures';
              targetArray = media.brochures;
              break;
            case 'additionalDocuments':
              s3Folder = 'projects/documents';
              targetArray = documents.others;
              break;
            default:
              s3Folder = 'projects/misc';
              targetArray = documents.others;
          }

          // Upload file to S3
          const uploadResult = await this.s3Service.uploadFile(file, s3Folder);
          targetArray.push(uploadResult.url);
        }
      }

      // Add media and documents to project data if files were uploaded
      if (media.images.length > 0 || media.floorPlans.length > 0 || media.brochures.length > 0) {
        createProjectDto.media = { ...createProjectDto.media, ...media };
      }

      if (documents.others.length > 0) {
        createProjectDto.documents = { ...createProjectDto.documents, ...documents };
      }

      // Create project
      const project = await this.projectsService.create(createProjectDto, req.user.id);
      return ResponseUtil.created(project, 'Project created successfully');

    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Get all projects with pagination and filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get All Projects',
    description: 'Retrieve all projects with advanced filtering and pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by city' })
  @ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Maximum price' })
  @ApiSuccessResponse({
    description: 'Projects retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Projects retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              projectName: { type: 'string' },
              projectDescription: { type: 'string' },
              projectStatus: { type: 'string' },
              propertyType: { type: 'string' },
              location: { type: 'object' },
              builder: { type: 'object' },
              priceMin: { type: 'number' },
              priceMax: { type: 'number' },
              createdAt: { type: 'string' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async findAll(@Query() queryDto: QueryProjectDto) {
    const result = await this.projectsService.findAll(queryDto);
    return ResponseUtil.paginated(
      result.projects,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Projects retrieved successfully'
    );
  }

  /**
   * Get project by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get Project by ID',
    description: 'Retrieve a specific project by its ID with full details',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiSuccessResponse({
    description: 'Project retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Project retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            projectName: { type: 'string' },
            projectDescription: { type: 'string' },
            projectStatus: { type: 'string' },
            propertyType: { type: 'string' },
            location: { type: 'object' },
            builder: { type: 'object' },
            unitConfigurations: { type: 'array' },
            amenities: { type: 'object' },
            media: { type: 'object' },
            documents: { type: 'object' },
            viewCount: { type: 'number' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse('Project not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findById(id);
    return ResponseUtil.success(project, 'Project retrieved successfully');
  }

  /**
   * Update project by ID
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Project',
    description: 'Update project information by ID',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiSuccessResponse({
    description: 'Project updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Project updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            projectName: { type: 'string' },
            projectDescription: { type: 'string' },
            projectStatus: { type: 'string' },
            propertyType: { type: 'string' },
            location: { type: 'object' },
            builder: { type: 'object' },
            unitConfigurations: { type: 'array' },
            updatedAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid input data')
  @ApiNotFoundResponse('Project not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req
  ) {
    const project = await this.projectsService.update(id, updateProjectDto, req.user._id);
    return ResponseUtil.success(project, 'Project updated successfully');
  }

  /**
   * Delete project by ID (soft delete)
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Project',
    description: 'Soft delete project by setting isActive to false',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiSuccessResponse({
    description: 'Project deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Project deleted successfully' },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse('Project not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(id);
    return ResponseUtil.successMessage('Project deleted successfully');
  }

  /**
   * Upload project media files
   */
  @Post(':id/media/:type')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload Project Media',
    description: 'Upload media files (images, videos, brochures, etc.) for a project',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({
    name: 'type',
    description: 'Media type',
    enum: ['images', 'videos', 'brochures', 'floorPlans', 'masterPlan', 'locationMap'],
  })
  @ApiSuccessResponse({
    description: 'Media files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Media files uploaded successfully' },
        data: {
          type: 'array',
          items: { type: 'string' },
          example: ['https://s3.amazonaws.com/bucket/project1/images/image1.jpg'],
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid files or project not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async uploadMedia(
    @Param('id') id: string,
    @Param('type') type: 'images' | 'videos' | 'brochures' | 'floorPlans' | 'masterPlan' | 'locationMap',
    @UploadedFiles() files: any[],
    @Request() req
  ) {
    const urls = await this.projectsService.uploadMedia(id, files, type, req.user._id);
    return ResponseUtil.success(urls, 'Media files uploaded successfully');
  }

  /**
   * Upload project documents
   */
  @Post(':id/documents/:type')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload Project Documents',
    description: 'Upload document files (approvals, legal documents, certificates, etc.) for a project',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({
    name: 'type',
    description: 'Document type',
    enum: ['approvals', 'legalDocuments', 'certificates', 'others'],
  })
  @ApiSuccessResponse({
    description: 'Document files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Document files uploaded successfully' },
        data: {
          type: 'array',
          items: { type: 'string' },
          example: ['https://s3.amazonaws.com/bucket/project1/documents/approval.pdf'],
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid files or project not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async uploadDocuments(
    @Param('id') id: string,
    @Param('type') type: 'approvals' | 'legalDocuments' | 'certificates' | 'others',
    @UploadedFiles() files: any[],
    @Request() req
  ) {
    const urls = await this.projectsService.uploadDocuments(id, files, type, req.user._id);
    return ResponseUtil.success(urls, 'Document files uploaded successfully');
  }

  /**
   * Get project statistics
   */
  @Get('admin/statistics')
  @ApiOperation({
    summary: 'Get Project Statistics',
    description: 'Get comprehensive project statistics (Admin only)',
  })
  @ApiSuccessResponse({
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Statistics retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            totalProjects: { type: 'number' },
            activeProjects: { type: 'number' },
            inactiveProjects: { type: 'number' },
            featuredProjects: { type: 'number' },
            statusDistribution: { type: 'object' },
            propertyTypeDistribution: { type: 'object' },
            topCities: { type: 'array' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getStatistics() {
    const stats = await this.projectsService.getStatistics();
    return ResponseUtil.success(stats, 'Statistics retrieved successfully');
  }

  /**
   * Get featured projects
   */
  @Get('featured')
  @ApiOperation({
    summary: 'Get Featured Projects',
    description: 'Get list of featured projects',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of projects to return' })
  @ApiSuccessResponse({
    description: 'Featured projects retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Featured projects retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              projectName: { type: 'string' },
              projectDescription: { type: 'string' },
              location: { type: 'object' },
              builder: { type: 'object' },
              media: { type: 'object' },
              priceMin: { type: 'number' },
              priceMax: { type: 'number' },
            },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getFeaturedProjects(@Query('limit') limit: number = 10) {
    const projects = await this.projectsService.getFeaturedProjects(limit);
    return ResponseUtil.success(projects, 'Featured projects retrieved successfully');
  }
}
