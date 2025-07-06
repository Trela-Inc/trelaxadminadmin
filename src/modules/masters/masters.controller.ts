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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MastersService } from './masters.service';
import { CreateMasterFieldDto } from './dto/create-master-field.dto';
import { UpdateMasterFieldDto } from './dto/update-master-field.dto';
import { QueryMasterFieldDto } from './dto/query-master-field.dto';
import { MasterFieldType } from './enums/master-type.enum';
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
 * Masters controller
 * Handles HTTP requests for master field management (form dropdowns)
 */
@ApiTags('🎛️ Masters')
@Controller('masters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  /**
   * Create a new master field
   */
  @Post()
  @ApiOperation({
    summary: '➕ Create Master Field',
    description: `
**Create a new master field for form dropdowns**

Master fields are used to populate dropdowns throughout the application:
- **Cities**: For location selection in projects
- **Locations**: Areas within cities (hierarchical)
- **Amenities**: Project features and facilities
- **Bedrooms**: Bedroom configurations (1 BHK, 2 BHK, etc.)
- **Bathrooms**: Bathroom options
- **Project Status**: Status options (Planned, Under Construction, etc.)
- **Property Types**: Residential, Commercial, etc.

**Field Types Available:**
- city, location, amenity, bedroom, bathroom
- project_status, property_type, builder_type, facing_direction

**Hierarchical Fields:**
For locations, specify parentId to link to a city.
    `,
  })
  @ApiCreatedResponse({
    description: 'Master field created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Master field created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fieldType: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            value: { type: 'string' },
            status: { type: 'string' },
            sortOrder: { type: 'number' },
            isDefault: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid input data or field already exists')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async create(@Body() createMasterFieldDto: CreateMasterFieldDto, @Request() req) {
    const field = await this.mastersService.create(createMasterFieldDto, req.user._id);
    return ResponseUtil.created(field, 'Master field created successfully');
  }

  /**
   * Get all master fields
   */
  @Get()
  @ApiOperation({
    summary: 'Get All Master Fields',
    description: 'Retrieve all master fields with pagination and filtering',
  })
  @ApiSuccessResponse({
    description: 'Master fields retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Master fields retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              fieldType: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              value: { type: 'string' },
              status: { type: 'string' },
              sortOrder: { type: 'number' },
              isDefault: { type: 'boolean' },
              createdAt: { type: 'string' },
            },
          },
        },
        pagination: { type: 'object' },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async findAll(@Query() queryDto: QueryMasterFieldDto) {
    const result = await this.mastersService.findAll(queryDto);
    return ResponseUtil.paginated(
      result.fields,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Master fields retrieved successfully'
    );
  }

  /**
   * Get master field by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get Master Field by ID',
    description: 'Retrieve a specific master field by its ID',
  })
  @ApiParam({ name: 'id', description: 'Master Field ID' })
  @ApiSuccessResponse({
    description: 'Master field retrieved successfully',
  })
  @ApiNotFoundResponse('Master field not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async findById(@Param('id') id: string) {
    const field = await this.mastersService.findById(id);
    return ResponseUtil.success(field, 'Master field retrieved successfully');
  }

  /**
   * Update master field
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Master Field',
    description: 'Update master field information by ID',
  })
  @ApiParam({ name: 'id', description: 'Master Field ID' })
  @ApiSuccessResponse({
    description: 'Master field updated successfully',
  })
  @ApiBadRequestResponse('Invalid input data')
  @ApiNotFoundResponse('Master field not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async update(
    @Param('id') id: string,
    @Body() updateMasterFieldDto: UpdateMasterFieldDto,
    @Request() req
  ) {
    const field = await this.mastersService.update(id, updateMasterFieldDto, req.user._id);
    return ResponseUtil.success(field, 'Master field updated successfully');
  }

  /**
   * Delete master field
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Master Field',
    description: 'Delete master field by ID (only if no child fields exist)',
  })
  @ApiParam({ name: 'id', description: 'Master Field ID' })
  @ApiSuccessResponse({
    description: 'Master field deleted successfully',
  })
  @ApiNotFoundResponse('Master field not found')
  @ApiBadRequestResponse('Cannot delete field with existing child fields')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async remove(@Param('id') id: string) {
    await this.mastersService.remove(id);
    return ResponseUtil.successMessage('Master field deleted successfully');
  }

  // ==================== DROPDOWN ENDPOINTS ====================

  /**
   * Get cities for dropdown
   */
  @Get('cities')
  @ApiOperation({
    summary: 'Get Cities',
    description: 'Get all active cities for dropdown selection',
  })
  @ApiSuccessResponse({
    description: 'Cities retrieved successfully',
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getCities() {
    const cities = await this.mastersService.getCities();
    return ResponseUtil.success(cities, 'Cities retrieved successfully');
  }

  /**
   * Get locations by city
   */
  @Get('locations/:cityId')
  @ApiOperation({
    summary: 'Get Locations by City',
    description: 'Get all active locations for a specific city',
  })
  @ApiParam({ name: 'cityId', description: 'City ID' })
  @ApiSuccessResponse({
    description: 'Locations retrieved successfully',
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getLocationsByCity(@Param('cityId') cityId: string) {
    const locations = await this.mastersService.getLocationsByCity(cityId);
    return ResponseUtil.success(locations, 'Locations retrieved successfully');
  }

  /**
   * Get amenities for dropdown
   */
  @Get('amenities')
  @ApiOperation({
    summary: 'Get Amenities',
    description: 'Get all active amenities for dropdown selection',
  })
  @ApiSuccessResponse({
    description: 'Amenities retrieved successfully',
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getAmenities() {
    const amenities = await this.mastersService.getAmenities();
    return ResponseUtil.success(amenities, 'Amenities retrieved successfully');
  }

  /**
   * Get bedrooms for dropdown
   */
  @Get('bedrooms')
  @ApiOperation({
    summary: 'Get Bedrooms',
    description: 'Get all active bedroom options for dropdown selection',
  })
  @ApiSuccessResponse({
    description: 'Bedrooms retrieved successfully',
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getBedrooms() {
    const bedrooms = await this.mastersService.getBedrooms();
    return ResponseUtil.success(bedrooms, 'Bedrooms retrieved successfully');
  }

  /**
   * Get bathrooms for dropdown
   */
  @Get('bathrooms')
  @ApiOperation({
    summary: 'Get Bathrooms',
    description: 'Get all active bathroom options for dropdown selection',
  })
  @ApiSuccessResponse({
    description: 'Bathrooms retrieved successfully',
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getBathrooms() {
    const bathrooms = await this.mastersService.getBathrooms();
    return ResponseUtil.success(bathrooms, 'Bathrooms retrieved successfully');
  }

  /**
   * Get master data statistics
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get Master Data Statistics',
    description: 'Get comprehensive statistics for all master data',
  })
  @ApiSuccessResponse({
    description: 'Statistics retrieved successfully',
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getStatistics() {
    const stats = await this.mastersService.getStatistics();
    return ResponseUtil.success(stats, 'Statistics retrieved successfully');
  }
}
