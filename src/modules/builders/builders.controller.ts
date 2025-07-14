import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BuildersService } from './builders.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';

@ApiTags('🏗️ Builders')
@Controller('builders')
@ApiBearerAuth('JWT-auth')
export class BuildersController {
  constructor(private readonly buildersService: BuildersService) {}

  @Post()
  @ApiOperation({ summary: 'Create Builder', description: 'Create a new builder' })
  async create(@Body() createBuilderDto: CreateBuilderDto) {
    const builder = await this.buildersService.create(createBuilderDto);
    return { success: true, message: 'Builder created successfully', data: builder };
  }

  @Get()
  @ApiOperation({ summary: 'Get All Builders', description: 'Retrieve all builders' })
  async findAll() {
    const builders = await this.buildersService.findAll();
    return { success: true, message: 'Builders retrieved successfully', data: builders };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Builder by ID', description: 'Retrieve a builder by ID' })
  @ApiParam({ name: 'id', description: 'Builder ID' })
  async findById(@Param('id') id: string) {
    const builder = await this.buildersService.findById(id);
    return { success: true, message: 'Builder retrieved successfully', data: builder };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Builder', description: 'Update a builder by ID' })
  @ApiParam({ name: 'id', description: 'Builder ID' })
  async update(@Param('id') id: string, @Body() updateBuilderDto: UpdateBuilderDto) {
    const builder = await this.buildersService.update(id, updateBuilderDto);
    return { success: true, message: 'Builder updated successfully', data: builder };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Builder', description: 'Delete a builder by ID' })
  @ApiParam({ name: 'id', description: 'Builder ID' })
  async remove(@Param('id') id: string) {
    await this.buildersService.remove(id);
    return { success: true, message: 'Builder deleted successfully' };
  }
} 