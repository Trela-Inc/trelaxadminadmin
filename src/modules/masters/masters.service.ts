import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// Schemas
import { MasterField, MasterFieldDocument } from './schemas/master-field.schema';

// DTOs
import { CreateMasterFieldDto } from './dto/create-master-field.dto';
import { UpdateMasterFieldDto } from './dto/update-master-field.dto';
import { QueryMasterFieldDto } from './dto/query-master-field.dto';
import { MasterFieldType } from './enums/master-type.enum';

/**
 * Masters service
 * Handles all master field operations for form dropdowns
 */
@Injectable()
export class MastersService {
  constructor(
    @InjectModel(MasterField.name) private masterFieldModel: Model<MasterFieldDocument>,
  ) {}

  /**
   * Create a new master field
   */
  async create(createMasterFieldDto: CreateMasterFieldDto): Promise<MasterField> {
    try {
      // Check if field already exists
      const existingField = await this.masterFieldModel.findOne({
        fieldType: createMasterFieldDto.fieldType,
        name: createMasterFieldDto.name,
      });

      if (existingField) {
        throw new ConflictException('Field with this name already exists for this type');
      }

      const masterField = new this.masterFieldModel({
        ...createMasterFieldDto,
        parentId: createMasterFieldDto.parentId ? new Types.ObjectId(createMasterFieldDto.parentId) : undefined,
      });

      return await masterField.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create master field');
    }
  }

  /**
   * Get all master fields with pagination and filtering
   */
  async findAll(queryDto: QueryMasterFieldDto) {
    let { page, limit, search, fieldType, status, parentId, isDefault, sortBy, sortOrder } = queryDto;

    // Fallback defaults
    if (!sortBy || !['name', 'createdAt', 'updatedAt', 'sortOrder'].includes(sortBy)) {
      sortBy = 'sortOrder';
    }
    if (!sortOrder || !['asc', 'desc'].includes(sortOrder)) {
      sortOrder = 'asc';
    }

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { value: { $regex: search, $options: 'i' } },
      ];
    }

    if (fieldType) {
      filter.fieldType = fieldType;
    }

    if (status) {
      filter.status = status;
    }

    if (parentId) {
      filter.parentId = new Types.ObjectId(parentId);
    }

    if (typeof isDefault === 'boolean') {
      filter.isDefault = isDefault;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [fields, total] = await Promise.all([
      this.masterFieldModel
        .find(filter)
        .populate('parentId', 'name fieldType')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.masterFieldModel.countDocuments(filter),
    ]);

    return {
      fields,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get master field by ID
   */
  async findById(id: string): Promise<MasterField> {
    try {
      const field = await this.masterFieldModel
        .findById(id)
        .populate('parentId', 'name fieldType')
        .exec();

      if (!field) {
        throw new NotFoundException('Master field not found');
      }

      return field;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid master field ID');
    }
  }

  /**
   * Update master field
   */
  async update(id: string, updateMasterFieldDto: UpdateMasterFieldDto): Promise<MasterField> {
    try {
      const updateData = {
        ...updateMasterFieldDto,
        parentId: updateMasterFieldDto.parentId ? new Types.ObjectId(updateMasterFieldDto.parentId) : undefined,
      };

      const field = await this.masterFieldModel
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('parentId', 'name fieldType')
        .exec();

      if (!field) {
        throw new NotFoundException('Master field not found');
      }

      return field;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update master field');
    }
  }

  /**
   * Delete master field
   */
  async remove(id: string): Promise<void> {
    try {
      // Check if field has children (for hierarchical data)
      const childCount = await this.masterFieldModel.countDocuments({ parentId: id });
      if (childCount > 0) {
        throw new BadRequestException('Cannot delete field with existing child fields');
      }

      const result = await this.masterFieldModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('Master field not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete master field');
    }
  }

  /**
   * Get fields by type (for dropdown population)
   */
  async getFieldsByType(fieldType: MasterFieldType, parentId?: string): Promise<MasterField[]> {
    const filter: any = {
      fieldType,
      status: 'active'
    };

    if (parentId) {
      if (Types.ObjectId.isValid(parentId)) {
        filter.parentId = new Types.ObjectId(parentId);
      } else {
        // Skip filtering by parentId if invalid
        console.warn('Invalid parentId provided to getFieldsByType:', parentId);
      }
    }

    return await this.masterFieldModel
      .find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  /**
   * Get cities for dropdown
   */
  async getCities(): Promise<MasterField[]> {
    return this.getFieldsByType(MasterFieldType.CITY);
  }

  /**
   * Get locations for a city
   */
  async getLocationsByCity(cityId: string): Promise<MasterField[]> {
    return this.getFieldsByType(MasterFieldType.LOCATION, cityId);
  }

  /**
   * Get amenities for dropdown
   */
  async getAmenities(): Promise<MasterField[]> {
    return this.getFieldsByType(MasterFieldType.AMENITY);
  }

  /**
   * Get bedroom options
   */
  async getBedrooms(): Promise<MasterField[]> {
    return this.getFieldsByType(MasterFieldType.BEDROOM);
  }

  /**
   * Get bathroom options
   */
  async getBathrooms(): Promise<MasterField[]> {
    return this.getFieldsByType(MasterFieldType.BATHROOM);
  }

  /**
   * Get master data statistics
   */
  async getStatistics() {
    const fieldTypes = Object.values(MasterFieldType);
    const stats: any = {};

    for (const fieldType of fieldTypes) {
      const [total, active] = await Promise.all([
        this.masterFieldModel.countDocuments({ fieldType }),
        this.masterFieldModel.countDocuments({ fieldType, status: 'active' }),
      ]);

      stats[fieldType] = { total, active };
    }

    return stats;
  }

  /**
   * Bulk create master fields (for seeding)
   */
  async bulkCreate(fields: CreateMasterFieldDto[], userId: string): Promise<any[]> {
    const masterFields = fields.map(field => ({
      ...field,
      parentId: field.parentId ? new Types.ObjectId(field.parentId) : undefined,
      createdBy: new Types.ObjectId(userId),
      status: field.status || 'active', // Ensure status is always set
    }));

    return await this.masterFieldModel.insertMany(masterFields);
  }
}
