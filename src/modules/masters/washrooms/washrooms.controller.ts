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
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { WashroomsService } from './washrooms.service';
import { CreateWashroomDto } from './dto/create-washroom.dto';
import { UpdateWashroomDto } from './dto/update-washroom.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Masters - Washrooms')
@Controller('masters/washrooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WashroomsController {
  constructor(private readonly washroomsService: WashroomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new washroom configuration' })
  @ApiBody({ type: CreateWashroomDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Washroom configuration created successfully' })
  async create(@Body(ValidationPipe) createWashroomDto: CreateWashroomDto) {
    const washroom = await this.washroomsService.createWashroom(createWashroomDto);
    return {
      success: true,
      data: washroom,
      message: 'Washroom configuration created successfully'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all washroom configurations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Washroom configurations retrieved successfully' })
  async findAll(@Query(ValidationPipe) queryDto: QueryMasterWithNumericRangeDto) {
    return await this.washroomsService.findAllWashrooms(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get washroom statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Washroom statistics retrieved successfully' })
  async getStatistics() {
    const statistics = await this.washroomsService.getWashroomStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Washroom statistics retrieved successfully'
    };
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get washrooms by type' })
  @ApiParam({ name: 'type', description: 'Washroom type', example: 'attached' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Washrooms retrieved successfully' })
  async findByType(@Param('type') type: string) {
    const washrooms = await this.washroomsService.findWashroomsByType(type);
    return {
      success: true,
      data: washrooms,
      message: `${type} washrooms retrieved successfully`
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get washroom configuration by ID' })
  @ApiParam({ name: 'id', description: 'Washroom ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Washroom configuration retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const washroom = await this.washroomsService.findWashroomById(id);
    return {
      success: true,
      data: washroom,
      message: 'Washroom configuration retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update washroom configuration by ID' })
  @ApiParam({ name: 'id', description: 'Washroom ID' })
  @ApiBody({ type: UpdateWashroomDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Washroom configuration updated successfully' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateWashroomDto: UpdateWashroomDto) {
    const washroom = await this.washroomsService.updateWashroom(id, updateWashroomDto);
    return {
      success: true,
      data: washroom,
      message: 'Washroom configuration updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete washroom configuration by ID' })
  @ApiParam({ name: 'id', description: 'Washroom ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Washroom configuration deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.washroomsService.removeWashroom(id);
    return {
      success: true,
      message: 'Washroom configuration deleted successfully'
    };
  }
}
