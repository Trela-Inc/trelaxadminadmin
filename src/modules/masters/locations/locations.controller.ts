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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryLocationDto } from './dto/query-location.dto';
import { 
  LocationResponseDto, 
  LocationListResponseDto, 
  SingleLocationResponseDto 
} from './dto/location-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Locations Controller
 * Handles HTTP requests for location master data management
 */
@ApiTags('Masters - Locations')
@Controller('masters/locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Create a new location
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new location',
    description: 'Create a new location master data entry with comprehensive information including connectivity, real estate data, and nearby facilities.'
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Location created successfully',
    type: SingleLocationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or parent city not found'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Location with same name already exists in the city'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async create(@Body(ValidationPipe) createLocationDto: CreateLocationDto) {
    const location = await this.locationsService.createLocation(createLocationDto);
    return {
      success: true,
      data: location,
      message: 'Location created successfully'
    };
  }

  /**
   * Get all locations with filtering and pagination
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all locations',
    description: 'Retrieve all locations with advanced filtering, search, and pagination capabilities.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Locations retrieved successfully',
    type: LocationListResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findAll(@Query(ValidationPipe) queryDto: QueryLocationDto) {
    return await this.locationsService.findAllLocations(queryDto);
  }

  /**
   * Get location statistics
   */
  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get location statistics',
    description: 'Retrieve comprehensive statistics about locations including counts by type, category, and real estate data.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location statistics retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async getStatistics() {
    const statistics = await this.locationsService.getLocationStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Location statistics retrieved successfully'
    };
  }

  /**
   * Get popular locations
   */
  @Get('popular')
  @ApiOperation({ 
    summary: 'Get popular locations',
    description: 'Retrieve list of popular locations marked as popular in the system.'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of popular locations to retrieve',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular locations retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findPopular(@Query('limit') limit?: number) {
    const locations = await this.locationsService.findPopularLocations(limit);
    return {
      success: true,
      data: locations,
      message: 'Popular locations retrieved successfully'
    };
  }

  /**
   * Get locations by city
   */
  @Get('by-city/:cityId')
  @ApiOperation({ 
    summary: 'Get locations by city',
    description: 'Retrieve all locations belonging to a specific city.'
  })
  @ApiParam({ 
    name: 'cityId', 
    description: 'City ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Locations retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByCity(@Param('cityId') cityId: string) {
    const locations = await this.locationsService.findLocationsByCity(cityId);
    return {
      success: true,
      data: locations,
      message: 'Locations retrieved successfully'
    };
  }

  /**
   * Get locations by type
   */
  @Get('by-type/:type')
  @ApiOperation({ 
    summary: 'Get locations by type',
    description: 'Retrieve all locations of a specific type (residential, commercial, etc.).'
  })
  @ApiParam({ 
    name: 'type', 
    description: 'Location type',
    example: 'residential'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Locations retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByType(@Param('type') type: string) {
    const locations = await this.locationsService.findLocationsByType(type);
    return {
      success: true,
      data: locations,
      message: `${type} locations retrieved successfully`
    };
  }

  /**
   * Find locations near coordinates
   */
  @Get('near')
  @ApiOperation({ 
    summary: 'Find locations near coordinates',
    description: 'Find locations near a specific geographical location using coordinates.'
  })
  @ApiQuery({ 
    name: 'longitude', 
    required: true, 
    type: Number, 
    description: 'Longitude coordinate',
    example: 72.8265
  })
  @ApiQuery({ 
    name: 'latitude', 
    required: true, 
    type: Number, 
    description: 'Latitude coordinate',
    example: 19.0596
  })
  @ApiQuery({ 
    name: 'maxDistance', 
    required: false, 
    type: Number, 
    description: 'Maximum distance in meters',
    example: 50000
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nearby locations retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid coordinates'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findNearLocation(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('maxDistance') maxDistance?: number
  ) {
    const locations = await this.locationsService.findLocationsNearLocation(
      longitude, 
      latitude, 
      maxDistance
    );
    return {
      success: true,
      data: locations,
      message: 'Nearby locations retrieved successfully'
    };
  }

  /**
   * Get location by ID
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get location by ID',
    description: 'Retrieve a specific location by its unique identifier.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Location ID',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location retrieved successfully',
    type: SingleLocationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Location not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid location ID'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findOne(@Param('id') id: string) {
    const location = await this.locationsService.findLocationById(id);
    return {
      success: true,
      data: location,
      message: 'Location retrieved successfully'
    };
  }

  /**
   * Update location by ID
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update location by ID',
    description: 'Update a specific location with new information.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Location ID',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location updated successfully',
    type: SingleLocationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Location not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or location ID'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Location with same name already exists in the city'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateLocationDto: UpdateLocationDto
  ) {
    const location = await this.locationsService.updateLocation(id, updateLocationDto);
    return {
      success: true,
      data: location,
      message: 'Location updated successfully'
    };
  }

  /**
   * Delete location by ID
   */
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete location by ID',
    description: 'Soft delete a specific location (marks as archived).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Location ID',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Location not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete location as it is being used'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async remove(@Param('id') id: string) {
    await this.locationsService.removeLocation(id);
    return {
      success: true,
      message: 'Location deleted successfully'
    };
  }
}
