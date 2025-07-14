import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@ApiTags('👨‍💼 Agents')
@Controller('agents')
@ApiBearerAuth('JWT-auth')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Agent', description: 'Create a new agent' })
  async create(@Body() createAgentDto: CreateAgentDto) {
    const agent = await this.agentsService.create(createAgentDto);
    return { success: true, message: 'Agent created successfully', data: agent };
  }

  @Get()
  @ApiOperation({ summary: 'Get All Agents', description: 'Retrieve all agents' })
  async findAll() {
    const agents = await this.agentsService.findAll();
    return { success: true, message: 'Agents retrieved successfully', data: agents };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Agent by ID', description: 'Retrieve an agent by ID' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  async findById(@Param('id') id: string) {
    const agent = await this.agentsService.findById(id);
    return { success: true, message: 'Agent retrieved successfully', data: agent };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Agent', description: 'Update an agent by ID' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  async update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    const agent = await this.agentsService.update(id, updateAgentDto);
    return { success: true, message: 'Agent updated successfully', data: agent };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Agent', description: 'Delete an agent by ID' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  async remove(@Param('id') id: string) {
    await this.agentsService.remove(id);
    return { success: true, message: 'Agent deleted successfully' };
  }
} 