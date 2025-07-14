import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { Model, Document, Types } from 'mongoose';
import { 
  BaseMaster, 
  BaseMasterDocument 
} from '../schemas/base-master.schema';
import { 
  MasterQueryOptions, 
  MasterListResponse, 
  MasterResponse,
  MasterStatistics 
} from '../interfaces/base-master.interface';
import { MasterStatus, MasterType } from '../enums/master-types.enum';

/**
 * Base Master Service
 * Common CRUD operations for all master data types
 */
@Injectable()
export abstract class BaseMasterService<T extends BaseMaster> {
  constructor(
    protected readonly model: Model<T & Document>,
    protected readonly masterType: MasterType
  ) {}

  /**
   * Create a new master data entry
   */
  async create(createDto: Partial<T>): Promise<T> {
    try {
      // Check if entry with same name and type already exists
      const existingEntry = await this.model.findOne({
        name: createDto.name,
        masterType: this.masterType,
        status: { $ne: MasterStatus.ARCHIVED }
      });

      if (existingEntry) {
        throw new ConflictException(
          `${this.masterType} with name '${createDto.name}' already exists`
        );
      }

      // Check if code is provided and unique
      if (createDto.code) {
        const existingCode = await this.model.findOne({
          code: createDto.code,
          masterType: this.masterType,
          status: { $ne: MasterStatus.ARCHIVED }
        });

        if (existingCode) {
          throw new ConflictException(
            `${this.masterType} with code '${createDto.code}' already exists`
          );
        }
      }

      const createdEntry = new this.model({
        ...createDto,
        masterType: this.masterType
      });

      return await createdEntry.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create ${this.masterType}: ${error.message}`);
    }
  }

  /**
   * Find all master data entries with filtering and pagination
   */
  async findAll(queryOptions: MasterQueryOptions = {}): Promise<MasterListResponse<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        isDefault,
        isPopular,
        sortBy = 'sortOrder',
        sortOrder = 'asc',
        parentId,
        category
      } = queryOptions;

      // Build filter object
      const filter: any = { 
        masterType: this.masterType,
        status: { $ne: MasterStatus.ARCHIVED }
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) {
        filter.status = status;
      }

      if (typeof isDefault === 'boolean') {
        filter.isDefault = isDefault;
      }

      if (typeof isPopular === 'boolean') {
        filter.isPopular = isPopular;
      }

      if (parentId) {
        filter.parentId = new Types.ObjectId(parentId);
      }

      if (category) {
        filter.category = category;
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [data, total] = await Promise.all([
        this.model
          .find(filter)
          .populate('parentId', 'name masterType')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.model.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as T[],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch ${this.masterType} data: ${error.message}`);
    }
  }

  /**
   * Find master data entry by ID
   */
  async findById(id: string): Promise<T> {
    try {
      let query = this.model.findOne({
        _id: id,
        masterType: this.masterType,
        status: { $ne: MasterStatus.ARCHIVED }
      });

      // Only populate parentId if the schema has this field
      // Cities don't have parentId, but locations do
      if (this.masterType !== MasterType.CITY) {
        query = query.populate('parentId', 'name masterType');
      }

      const entry = await query.exec();

      if (!entry) {
        throw new NotFoundException(`${this.masterType} with ID ${id} not found`);
      }

      return entry as T;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Invalid ${this.masterType} ID: ${error.message}`);
    }
  }

  /**
   * Update master data entry by ID
   */
  async update(id: string, updateDto: Partial<T>): Promise<T> {
    try {
      // Check if entry exists
      const existingEntry = await this.findById(id);

      // Check for name conflicts (excluding current entry)
      if (updateDto.name && updateDto.name !== existingEntry.name) {
        const nameConflict = await this.model.findOne({
          name: updateDto.name,
          masterType: this.masterType,
          _id: { $ne: id },
          status: { $ne: MasterStatus.ARCHIVED }
        });

        if (nameConflict) {
          throw new ConflictException(
            `${this.masterType} with name '${updateDto.name}' already exists`
          );
        }
      }

      // Check for code conflicts (excluding current entry)
      if (updateDto.code && updateDto.code !== existingEntry.code) {
        const codeConflict = await this.model.findOne({
          code: updateDto.code,
          masterType: this.masterType,
          _id: { $ne: id },
          status: { $ne: MasterStatus.ARCHIVED }
        });

        if (codeConflict) {
          throw new ConflictException(
            `${this.masterType} with code '${updateDto.code}' already exists`
          );
        }
      }

      let updateQuery = this.model
        .findByIdAndUpdate(id, updateDto as any, { new: true, runValidators: true });

      // Only populate parentId if the schema has this field
      if (this.masterType !== MasterType.CITY) {
        updateQuery = updateQuery.populate('parentId', 'name masterType');
      }

      const updatedEntry = await updateQuery.exec();

      return updatedEntry as unknown as T;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update ${this.masterType}: ${error.message}`);
    }
  }

  /**
   * Soft delete master data entry by ID
   */
  async remove(id: string): Promise<void> {
    try {
      const entry = await this.findById(id);

      // Check if entry is being used in other collections
      // This should be implemented by child classes if needed
      await this.checkUsageBeforeDelete(id);

      await this.model.findByIdAndUpdate(id, { 
        status: MasterStatus.ARCHIVED 
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete ${this.masterType}: ${error.message}`);
    }
  }

  /**
   * Get statistics for master data
   */
  async getStatistics(): Promise<MasterStatistics> {
    try {
      const [
        totalCount,
        activeCount,
        inactiveCount,
        popularCount,
        defaultCount,
        categoryStats,
        statusStats
      ] = await Promise.all([
        this.model.countDocuments({ 
          masterType: this.masterType,
          status: { $ne: MasterStatus.ARCHIVED }
        }),
        this.model.countDocuments({ 
          masterType: this.masterType,
          status: MasterStatus.ACTIVE 
        }),
        this.model.countDocuments({ 
          masterType: this.masterType,
          status: MasterStatus.INACTIVE 
        }),
        this.model.countDocuments({ 
          masterType: this.masterType,
          isPopular: true,
          status: { $ne: MasterStatus.ARCHIVED }
        }),
        this.model.countDocuments({ 
          masterType: this.masterType,
          isDefault: true,
          status: { $ne: MasterStatus.ARCHIVED }
        }),
        this.model.aggregate([
          { 
            $match: { 
              masterType: this.masterType,
              status: { $ne: MasterStatus.ARCHIVED },
              category: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        this.model.aggregate([
          { 
            $match: { 
              masterType: this.masterType,
              status: { $ne: MasterStatus.ARCHIVED }
            }
          },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
      ]);

      const byCategory = categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byStatus = statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        totalCount,
        activeCount,
        inactiveCount,
        popularCount,
        defaultCount,
        byCategory,
        byStatus
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get ${this.masterType} statistics: ${error.message}`);
    }
  }

  /**
   * Check if master data entry is being used before deletion
   * Should be overridden by child classes
   */
  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // Default implementation - no checks
    // Child classes should override this method to check for usage
  }

  /**
   * Find entries by parent ID
   */
  async findByParentId(parentId: string): Promise<T[]> {
    try {
      return await this.model
        .find({ 
          parentId: new Types.ObjectId(parentId),
          masterType: this.masterType,
          status: { $ne: MasterStatus.ARCHIVED }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec() as T[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch ${this.masterType} by parent: ${error.message}`);
    }
  }

  /**
   * Find entries by category
   */
  async findByCategory(category: string): Promise<T[]> {
    try {
      return await this.model
        .find({ 
          category,
          masterType: this.masterType,
          status: { $ne: MasterStatus.ARCHIVED }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec() as T[];
    } catch (error) {
      throw new BadRequestException(`Failed to fetch ${this.masterType} by category: ${error.message}`);
    }
  }
}
