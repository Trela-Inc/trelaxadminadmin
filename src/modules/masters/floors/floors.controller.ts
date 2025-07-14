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
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Floors Controller
 * Handles HTTP requests for floor master data management
 */
@ApiTags('Masters - Floors')
@Controller('masters/floors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  /**
   * Create a new floor
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new floor',
    description: 'Create a new floor master data entry with specifications and amenities.'
  })
  @ApiBody({ type: CreateFloorDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Floor created successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Floor with same number or code already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async create(@Body(ValidationPipe) createFloorDto: CreateFloorDto) {
    const floor = await this.floorsService.createFloor(createFloorDto);
    return {
      success: true,
      data: floor,
      message: 'Floor created successfully'
    };
  }

  /**
   * Get all floors with filtering and pagination
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all floors',
    description: 'Retrieve all floors with filtering, search, and pagination capabilities.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findAll(@Query(ValidationPipe) queryDto: QueryMasterWithNumericRangeDto) {
    return await this.floorsService.findAllFloors(queryDto);
  }

  /**
   * Get floor statistics
   */
  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get floor statistics',
    description: 'Retrieve comprehensive statistics about floors including counts by type and usage.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floor statistics retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async getStatistics() {
    const statistics = await this.floorsService.getFloorStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Floor statistics retrieved successfully'
    };
  }

  /**
   * Get available floors
   */
  @Get('available')
  @ApiOperation({ 
    summary: 'Get available floors',
    description: 'Retrieve list of floors that are available for booking.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Available floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findAvailable() {
    const floors = await this.floorsService.findAvailableFloors();
    return {
      success: true,
      data: floors,
      message: 'Available floors retrieved successfully'
    };
  }

  /**
   * Get floors by type
   */
  @Get('type/:type')
  @ApiOperation({ 
    summary: 'Get floors by type',
    description: 'Retrieve all floors of a specific type (basement, ground, regular, etc.).'
  })
  @ApiParam({ 
    name: 'type', 
    description: 'Floor type',
    example: 'regular'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByType(@Param('type') type: string) {
    const floors = await this.floorsService.findFloorsByType(type);
    return {
      success: true,
      data: floors,
      message: `${type} floors retrieved successfully`
    };
  }

  /**
   * Get floors by usage
   */
  @Get('usage/:usage')
  @ApiOperation({ 
    summary: 'Get floors by usage',
    description: 'Retrieve all floors with a specific usage (residential, commercial, etc.).'
  })
  @ApiParam({ 
    name: 'usage', 
    description: 'Floor usage',
    example: 'residential'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findByUsage(@Param('usage') usage: string) {
    const floors = await this.floorsService.findFloorsByUsage(usage);
    return {
      success: true,
      data: floors,
      message: `${usage} floors retrieved successfully`
    };
  }

  /**
   * Get floors in range
   */
  @Get('range')
  @ApiOperation({ 
    summary: 'Get floors in range',
    description: 'Retrieve floors within a specific floor number range.'
  })
  @ApiQuery({ 
    name: 'min', 
    required: true, 
    type: Number, 
    description: 'Minimum floor number',
    example: 1
  })
  @ApiQuery({ 
    name: 'max', 
    required: true, 
    type: Number, 
    description: 'Maximum floor number',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floors in range retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid range parameters'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findInRange(
    @Query('min') min: number,
    @Query('max') max: number
  ) {
    const floors = await this.floorsService.findFloorsInRange(min, max);
    return {
      success: true,
      data: floors,
      message: `Floors from ${min} to ${max} retrieved successfully`
    };
  }

  /**
   * Get basement floors
   */
  @Get('basement')
  @ApiOperation({ 
    summary: 'Get basement floors',
    description: 'Retrieve all basement floors (below ground level).'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basement floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findBasement() {
    const floors = await this.floorsService.findBasementFloors();
    return {
      success: true,
      data: floors,
      message: 'Basement floors retrieved successfully'
    };
  }

  /**
   * Get ground floor
   */
  @Get('ground')
  @ApiOperation({ 
    summary: 'Get ground floor',
    description: 'Retrieve the ground floor (floor number 0).'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ground floor retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ground floor not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findGround() {
    const floor = await this.floorsService.findGroundFloor();
    return {
      success: true,
      data: floor,
      message: 'Ground floor retrieved successfully'
    };
  }

  /**
   * Get upper floors
   */
  @Get('upper')
  @ApiOperation({ 
    summary: 'Get upper floors',
    description: 'Retrieve all upper floors (above ground level).'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upper floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findUpper() {
    const floors = await this.floorsService.findUpperFloors();
    return {
      success: true,
      data: floors,
      message: 'Upper floors retrieved successfully'
    };
  }

  /**
   * Get premium floors
   */
  @Get('premium')
  @ApiOperation({ 
    summary: 'Get premium floors',
    description: 'Retrieve floors with premium pricing (price multiplier > 1).'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Premium floors retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findPremium() {
    const floors = await this.floorsService.findPremiumFloors();
    return {
      success: true,
      data: floors,
      message: 'Premium floors retrieved successfully'
    };
  }

  /**
   * Get floor by ID
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get floor by ID',
    description: 'Retrieve a specific floor by its unique identifier.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Floor ID',
    example: '507f1f77bcf86cd799439014'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floor retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Floor not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid floor ID'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async findOne(@Param('id') id: string) {
    const floor = await this.floorsService.findFloorById(id);
    return {
      success: true,
      data: floor,
      message: 'Floor retrieved successfully'
    };
  }

  /**
   * Update floor by ID
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update floor by ID',
    description: 'Update a specific floor with new information.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Floor ID',
    example: '507f1f77bcf86cd799439014'
  })
  @ApiBody({ type: UpdateFloorDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floor updated successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Floor not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or floor ID'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Floor with same number or code already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateFloorDto: UpdateFloorDto
  ) {
    const floor = await this.floorsService.updateFloor(id, updateFloorDto);
    return {
      success: true,
      data: floor,
      message: 'Floor updated successfully'
    };
  }

  /**
   * Delete floor by ID
   */
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete floor by ID',
    description: 'Soft delete a specific floor (marks as archived).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Floor ID',
    example: '507f1f77bcf86cd799439014'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Floor deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Floor not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete floor as it is being used'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access'
  })
  async remove(@Param('id') id: string) {
    await this.floorsService.removeFloor(id);
    return {
      success: true,
      message: 'Floor deleted successfully'
    };
  }
}
