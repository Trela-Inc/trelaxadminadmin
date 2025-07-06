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
import { FilesInterceptor } from '@nestjs/platform-express';
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

/**
 * Projects controller
 * Handles HTTP requests for real estate project management operations
 */
@ApiTags('🏢 Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Create a new project
   */
  @Post()
  @ApiOperation({
    summary: '🏗️ Create New Project',
    description: `
**Create a new real estate project**

This endpoint allows you to create a comprehensive real estate project with:
- Basic project information (name, description, builder)
- Location details (city, address, coordinates)
- Property specifications (type, units, pricing)
- Amenities and features
- RERA compliance details

**Required Fields:**
- Project name and description
- Builder information
- Location (city, address)
- Property type and status
- At least one unit configuration

**Optional Fields:**
- Media files (images, videos)
- Documents (brochures, floor plans)
- Amenities list
- Pricing information
- RERA number
    `,
  })
  @ApiCreatedResponse({
    description: 'Project created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Project created successfully' },
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
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid input data or project already exists')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const project = await this.projectsService.create(createProjectDto, req.user._id);
    return ResponseUtil.created(project, 'Project created successfully');
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
