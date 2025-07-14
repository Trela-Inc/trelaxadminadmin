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
import { TowersService } from './towers.service';
import { CreateTowerDto } from './dto/create-tower.dto';
import { UpdateTowerDto } from './dto/update-tower.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Masters - Towers')
@Controller('masters/towers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TowersController {
  constructor(private readonly towersService: TowersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tower' })
  @ApiBody({ type: CreateTowerDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tower created successfully' })
  async create(@Body(ValidationPipe) createTowerDto: CreateTowerDto) {
    const tower = await this.towersService.createTower(createTowerDto);
    return {
      success: true,
      data: tower,
      message: 'Tower created successfully'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all towers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Towers retrieved successfully' })
  async findAll(@Query(ValidationPipe) queryDto: QueryMasterWithNumericRangeDto) {
    return await this.towersService.findAllTowers(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get tower statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tower statistics retrieved successfully' })
  async getStatistics() {
    const statistics = await this.towersService.getTowerStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Tower statistics retrieved successfully'
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active towers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Active towers retrieved successfully' })
  async findActive() {
    const towers = await this.towersService.findActiveTowers();
    return {
      success: true,
      data: towers,
      message: 'Active towers retrieved successfully'
    };
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get towers by type' })
  @ApiParam({ name: 'type', description: 'Tower type', example: 'residential' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Towers retrieved successfully' })
  async findByType(@Param('type') type: string) {
    const towers = await this.towersService.findTowersByType(type);
    return {
      success: true,
      data: towers,
      message: `${type} towers retrieved successfully`
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tower by ID' })
  @ApiParam({ name: 'id', description: 'Tower ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tower retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const tower = await this.towersService.findTowerById(id);
    return {
      success: true,
      data: tower,
      message: 'Tower retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tower by ID' })
  @ApiParam({ name: 'id', description: 'Tower ID' })
  @ApiBody({ type: UpdateTowerDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tower updated successfully' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateTowerDto: UpdateTowerDto) {
    const tower = await this.towersService.updateTower(id, updateTowerDto);
    return {
      success: true,
      data: tower,
      message: 'Tower updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tower by ID' })
  @ApiParam({ name: 'id', description: 'Tower ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tower deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.towersService.removeTower(id);
    return {
      success: true,
      message: 'Tower deleted successfully'
    };
  }
}
