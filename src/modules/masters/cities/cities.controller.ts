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
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { QueryCityDto } from './dto/query-city.dto';
import { 
  CityResponseDto, 
  CityListResponseDto, 
  SingleCityResponseDto 
} from './dto/city-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Cities Controller
 * Handles HTTP requests for city master data management
 */
@ApiTags('Masters - Cities')
@Controller('masters/cities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  /**
   * Create a new city
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new city',
    description: 'Create a new city master data entry with comprehensive information including geographical, economic, and real estate data.'
  })
  @ApiBody({ type: CreateCityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'City created successfully',
    type: SingleCityResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'City with same name or code already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async create(@Body(ValidationPipe) createCityDto: CreateCityDto) {
    const city = await this.citiesService.createCity(createCityDto);
    return {
      success: true,
      data: city,
      message: 'City created successfully'
    };
  }

  /**
   * Get all cities with filtering and pagination
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all cities',
    description: 'Retrieve all cities with advanced filtering, search, and pagination capabilities.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cities retrieved successfully',
    type: CityListResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findAll(@Query(ValidationPipe) queryDto: QueryCityDto) {
    return await this.citiesService.findAllCities(queryDto);
  }

  /**
   * Get city statistics
   */
  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get city statistics',
    description: 'Retrieve comprehensive statistics about cities including counts by state, country, and real estate data.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City statistics retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async getStatistics() {
    const statistics = await this.citiesService.getCityStatistics();
    return {
      success: true,
      data: statistics,
      message: 'City statistics retrieved successfully'
    };
  }

  /**
   * Get popular cities
   */
  @Get('popular')
  @ApiOperation({ 
    summary: 'Get popular cities',
    description: 'Retrieve list of popular cities marked as popular in the system.'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of popular cities to retrieve',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular cities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findPopular(@Query('limit') limit?: number) {
    const cities = await this.citiesService.findPopularCities(limit);
    return {
      success: true,
      data: cities,
      message: 'Popular cities retrieved successfully'
    };
  }

  /**
   * Get cities by state
   */
  @Get('by-state/:state')
  @ApiOperation({ 
    summary: 'Get cities by state',
    description: 'Retrieve all cities belonging to a specific state.'
  })
  @ApiParam({ 
    name: 'state', 
    description: 'State name',
    example: 'Maharashtra'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByState(@Param('state') state: string) {
    const cities = await this.citiesService.findCitiesByState(state);
    return {
      success: true,
      data: cities,
      message: `Cities in ${state} retrieved successfully`
    };
  }

  /**
   * Get cities by country
   */
  @Get('by-country/:country')
  @ApiOperation({ 
    summary: 'Get cities by country',
    description: 'Retrieve all cities belonging to a specific country.'
  })
  @ApiParam({ 
    name: 'country', 
    description: 'Country name',
    example: 'India'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cities retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByCountry(@Param('country') country: string) {
    const cities = await this.citiesService.findCitiesByCountry(country);
    return {
      success: true,
      data: cities,
      message: `Cities in ${country} retrieved successfully`
    };
  }

  /**
   * Find cities near location
   */
  @Get('near')
  @ApiOperation({ 
    summary: 'Find cities near location',
    description: 'Find cities near a specific geographical location using coordinates.'
  })
  @ApiQuery({ 
    name: 'longitude', 
    required: true, 
    type: Number, 
    description: 'Longitude coordinate',
    example: 72.8777
  })
  @ApiQuery({ 
    name: 'latitude', 
    required: true, 
    type: Number, 
    description: 'Latitude coordinate',
    example: 19.0760
  })
  @ApiQuery({ 
    name: 'maxDistance', 
    required: false, 
    type: Number, 
    description: 'Maximum distance in meters',
    example: 100000
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nearby cities retrieved successfully'
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
    const cities = await this.citiesService.findCitiesNearLocation(
      longitude, 
      latitude, 
      maxDistance
    );
    return {
      success: true,
      data: cities,
      message: 'Nearby cities retrieved successfully'
    };
  }

  /**
   * Get city by ID
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get city by ID',
    description: 'Retrieve a specific city by its unique identifier.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'City ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City retrieved successfully',
    type: SingleCityResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'City not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid city ID'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findOne(@Param('id') id: string) {
    const city = await this.citiesService.findCityById(id);
    return {
      success: true,
      data: city,
      message: 'City retrieved successfully'
    };
  }

  /**
   * Update city by ID
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update city by ID',
    description: 'Update a specific city with new information.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'City ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: UpdateCityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City updated successfully',
    type: SingleCityResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'City not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or city ID'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'City with same name or code already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateCityDto: UpdateCityDto
  ) {
    const city = await this.citiesService.updateCity(id, updateCityDto);
    return {
      success: true,
      data: city,
      message: 'City updated successfully'
    };
  }

  /**
   * Delete city by ID
   */
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete city by ID',
    description: 'Soft delete a specific city (marks as archived).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'City ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'City not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete city as it is being used'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async remove(@Param('id') id: string) {
    await this.citiesService.removeCity(id);
    return {
      success: true,
      message: 'City deleted successfully'
    };
  }
}
