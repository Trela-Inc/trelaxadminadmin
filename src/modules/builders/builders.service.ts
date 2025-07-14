import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Builder, BuilderDocument } from './schemas/builder.schema';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';

@Injectable()
export class BuildersService {
  constructor(
    @InjectModel(Builder.name) private builderModel: Model<BuilderDocument>,
  ) {}

  async create(createBuilderDto: CreateBuilderDto): Promise<Builder> {
    try {
      const existing = await this.builderModel.findOne({ name: createBuilderDto.name });
      if (existing) {
        throw new ConflictException('Builder with this name already exists');
      }
      const builder = new this.builderModel(createBuilderDto);
      return await builder.save();
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create builder');
    }
  }

  async findAll(): Promise<Builder[]> {
    return this.builderModel.find().exec();
  }

  async findById(id: string): Promise<Builder> {
    const builder = await this.builderModel.findById(id).exec();
    if (!builder) throw new NotFoundException('Builder not found');
    return builder;
  }

  async update(id: string, updateBuilderDto: UpdateBuilderDto): Promise<Builder> {
    const builder = await this.builderModel.findByIdAndUpdate(id, updateBuilderDto, { new: true, runValidators: true }).exec();
    if (!builder) throw new NotFoundException('Builder not found');
    return builder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.builderModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Builder not found');
  }
} 