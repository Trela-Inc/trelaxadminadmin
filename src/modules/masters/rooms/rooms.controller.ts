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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Masters - Rooms')
@Controller('masters/rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room configuration' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room configuration created successfully' })
  async create(@Body(ValidationPipe) createRoomDto: CreateRoomDto) {
    const room = await this.roomsService.createRoom(createRoomDto);
    return {
      success: true,
      data: room,
      message: 'Room configuration created successfully'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all room configurations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room configurations retrieved successfully' })
  async findAll(@Query(ValidationPipe) queryDto: QueryMasterWithNumericRangeDto) {
    return await this.roomsService.findAllRooms(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get room statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room statistics retrieved successfully' })
  async getStatistics() {
    const statistics = await this.roomsService.getRoomStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Room statistics retrieved successfully'
    };
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get rooms by type' })
  @ApiParam({ name: 'type', description: 'Room type', example: '2bhk' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Rooms retrieved successfully' })
  async findByType(@Param('type') type: string) {
    const rooms = await this.roomsService.findRoomsByType(type);
    return {
      success: true,
      data: rooms,
      message: `${type} rooms retrieved successfully`
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room configuration by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room configuration retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const room = await this.roomsService.findRoomById(id);
    return {
      success: true,
      data: room,
      message: 'Room configuration retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room configuration by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiBody({ type: UpdateRoomDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room configuration updated successfully' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsService.updateRoom(id, updateRoomDto);
    return {
      success: true,
      data: room,
      message: 'Room configuration updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room configuration by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room configuration deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.roomsService.removeRoom(id);
    return {
      success: true,
      message: 'Room configuration deleted successfully'
    };
  }
}
