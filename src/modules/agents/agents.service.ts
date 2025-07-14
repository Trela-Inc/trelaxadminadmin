import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from './schemas/agent.schema';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    try {
      const existing = await this.agentModel.findOne({ name: createAgentDto.name });
      if (existing) {
        throw new ConflictException('Agent with this name already exists');
      }
      const agent = new this.agentModel(createAgentDto);
      return await agent.save();
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create agent');
    }
  }

  async findAll(): Promise<Agent[]> {
    return this.agentModel.find().exec();
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.agentModel.findById(id).exec();
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.agentModel.findByIdAndUpdate(id, updateAgentDto, { new: true, runValidators: true }).exec();
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Agent not found');
  }
} 