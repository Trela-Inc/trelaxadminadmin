import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { QueryMasterWithCategoryDto } from '../common/dto/query-master.dto';
import { AmenityCategory } from '../common/enums/master-types.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Amenities Controller
 * Handles HTTP requests for amenity master data management
 */
@ApiTags('Masters - Amenities')
@Controller('masters/amenities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  /**
   * Create a new amenity
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new amenity',
    description: 'Create a new amenity master data entry with categorization and specifications.'
  })
  @ApiBody({ type: CreateAmenityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Amenity created successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Amenity with same name or code already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async create(@Body(ValidationPipe) createAmenityDto: CreateAmenityDto) {
    const amenity = await this.amenitiesService.createAmenity(createAmenityDto);
    return {
      success: true,
      data: amenity,
      message: 'Amenity created successfully'
    };
  }

  /**
   * Get all amenities with filtering and pagination
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all amenities',
    description: 'Retrieve all amenities with filtering, search, and pagination capabilities.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findAll(@Query(ValidationPipe) queryDto: QueryMasterWithCategoryDto) {
    return await this.amenitiesService.findAllAmenities(queryDto);
  }

  /**
   * Get amenity statistics
   */
  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get amenity statistics',
    description: 'Retrieve comprehensive statistics about amenities including counts by category and importance.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenity statistics retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async getStatistics() {
    const statistics = await this.amenitiesService.getAmenityStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Amenity statistics retrieved successfully'
    };
  }

  /**
   * Get popular amenities
   */
  @Get('popular')
  @ApiOperation({ 
    summary: 'Get popular amenities',
    description: 'Retrieve list of popular amenities based on popularity score.'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of popular amenities to retrieve',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findPopular(@Query('limit') limit?: number) {
    const amenities = await this.amenitiesService.findPopularAmenities(limit);
    return {
      success: true,
      data: amenities,
      message: 'Popular amenities retrieved successfully'
    };
  }

  /**
   * Get amenities by category
   */
  @Get('category/:category')
  @ApiOperation({ 
    summary: 'Get amenities by category',
    description: 'Retrieve all amenities belonging to a specific category.'
  })
  @ApiParam({ 
    name: 'category', 
    description: 'Amenity category',
    enum: AmenityCategory,
    example: AmenityCategory.RECREATIONAL
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByCategory(@Param('category') category: AmenityCategory) {
    const amenities = await this.amenitiesService.findAmenitiesByCategory(category);
    return {
      success: true,
      data: amenities,
      message: `${category} amenities retrieved successfully`
    };
  }

  /**
   * Get amenities by importance level
   */
  @Get('importance/:level')
  @ApiOperation({ 
    summary: 'Get amenities by importance level',
    description: 'Retrieve all amenities with a specific importance level (1-5).'
  })
  @ApiParam({ 
    name: 'level', 
    description: 'Importance level (1-5)',
    example: 4
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByImportance(@Param('level') level: number) {
    const amenities = await this.amenitiesService.findAmenitiesByImportance(level);
    return {
      success: true,
      data: amenities,
      message: `Level ${level} amenities retrieved successfully`
    };
  }

  /**
   * Get residential amenities
   */
  @Get('residential')
  @ApiOperation({ 
    summary: 'Get residential amenities',
    description: 'Retrieve amenities suitable for residential projects.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Residential amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findResidential() {
    const amenities = await this.amenitiesService.findResidentialAmenities();
    return {
      success: true,
      data: amenities,
      message: 'Residential amenities retrieved successfully'
    };
  }

  /**
   * Get commercial amenities
   */
  @Get('commercial')
  @ApiOperation({ 
    summary: 'Get commercial amenities',
    description: 'Retrieve amenities suitable for commercial projects.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commercial amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findCommercial() {
    const amenities = await this.amenitiesService.findCommercialAmenities();
    return {
      success: true,
      data: amenities,
      message: 'Commercial amenities retrieved successfully'
    };
  }

  /**
   * Get luxury amenities
   */
  @Get('luxury')
  @ApiOperation({ 
    summary: 'Get luxury amenities',
    description: 'Retrieve premium/luxury amenities.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Luxury amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findLuxury() {
    const amenities = await this.amenitiesService.findLuxuryAmenities();
    return {
      success: true,
      data: amenities,
      message: 'Luxury amenities retrieved successfully'
    };
  }

  /**
   * Get basic amenities
   */
  @Get('basic')
  @ApiOperation({ 
    summary: 'Get basic amenities',
    description: 'Retrieve basic/essential amenities.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basic amenities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findBasic() {
    const amenities = await this.amenitiesService.findBasicAmenities();
    return {
      success: true,
      data: amenities,
      message: 'Basic amenities retrieved successfully'
    };
  }

  /**
   * Search amenities by tags
   */
  @Get('search/tags')
  @ApiOperation({ 
    summary: 'Search amenities by tags',
    description: 'Search amenities using tags.'
  })
  @ApiQuery({ 
    name: 'tags', 
    required: true, 
    type: String, 
    description: 'Comma-separated tags',
    example: 'water,sports,fitness'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenities found successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async searchByTags(@Query('tags') tagsString: string) {
    const tags = tagsString.split(',').map(tag => tag.trim());
    const amenities = await this.amenitiesService.searchAmenitiesByTags(tags);
    return {
      success: true,
      data: amenities,
      message: 'Amenities found successfully'
    };
  }

  /**
   * Get amenity by ID
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get amenity by ID',
    description: 'Retrieve a specific amenity by its unique identifier.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Amenity ID',
    example: '507f1f77bcf86cd799439013'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenity retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Amenity not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid amenity ID'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findOne(@Param('id') id: string) {
    const amenity = await this.amenitiesService.findAmenityById(id);
    return {
      success: true,
      data: amenity,
      message: 'Amenity retrieved successfully'
    };
  }

  /**
   * Update amenity by ID
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update amenity by ID',
    description: 'Update a specific amenity with new information.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Amenity ID',
    example: '507f1f77bcf86cd799439013'
  })
  @ApiBody({ type: UpdateAmenityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenity updated successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Amenity not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or amenity ID'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Amenity with same name or code already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateAmenityDto: UpdateAmenityDto
  ) {
    const amenity = await this.amenitiesService.updateAmenity(id, updateAmenityDto);
    return {
      success: true,
      data: amenity,
      message: 'Amenity updated successfully'
    };
  }

  /**
   * Delete amenity by ID
   */
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete amenity by ID',
    description: 'Soft delete a specific amenity (marks as archived).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Amenity ID',
    example: '507f1f77bcf86cd799439013'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Amenity deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Amenity not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete amenity as it is being used'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async remove(@Param('id') id: string) {
    await this.amenitiesService.removeAmenity(id);
    return {
      success: true,
      message: 'Amenity deleted successfully'
    };
  }
}
