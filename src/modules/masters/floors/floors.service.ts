import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Floor, FloorDocument } from './schemas/floor.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType } from '../common/enums/master-types.enum';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

/**
 * Floors Service
 * Handles CRUD operations for floor master data
 */
@Injectable()
export class FloorsService extends BaseMasterService<Floor> {
  constructor(
    @InjectModel(Floor.name) private floorModel: Model<FloorDocument>
  ) {
    super(floorModel, MasterType.FLOOR);
  }

  /**
   * Create a new floor
   */
  async createFloor(createFloorDto: CreateFloorDto): Promise<Floor> {
    return await this.create(createFloorDto);
  }

  /**
   * Find all floors with advanced filtering
   */
  async findAllFloors(queryDto: QueryMasterWithNumericRangeDto = {}): Promise<MasterListResponse<Floor>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        isDefault,
        isPopular,
        sortBy = 'numericValue',
        sortOrder = 'asc',
        minValue,
        maxValue,
        unit
      } = queryDto;

      // Build filter object
      const filter: any = { 
        masterType: MasterType.FLOOR,
        status: { $ne: 'archived' }
      };

      // Basic filters
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { displayName: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { features: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) filter.status = status;
      if (typeof isDefault === 'boolean') filter.isDefault = isDefault;
      if (typeof isPopular === 'boolean') filter.isPopular = isPopular;
      if (unit) filter.unit = unit;

      // Numeric range filters
      if (minValue !== undefined || maxValue !== undefined) {
        filter.numericValue = {};
        if (minValue !== undefined) filter.numericValue.$gte = minValue;
        if (maxValue !== undefined) filter.numericValue.$lte = maxValue;
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [data, total] = await Promise.all([
        this.floorModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.floorModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as Floor[],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch floors: ${error.message}`);
    }
  }

  /**
   * Find floor by ID
   */
  async findFloorById(id: string): Promise<Floor> {
    return await this.findById(id);
  }

  /**
   * Update floor by ID
   */
  async updateFloor(id: string, updateFloorDto: UpdateFloorDto): Promise<Floor> {
    return await this.update(id, updateFloorDto);
  }

  /**
   * Delete floor by ID
   */
  async removeFloor(id: string): Promise<void> {
    return await this.remove(id);
  }

  /**
   * Find floors by type
   */
  async findFloorsByType(floorType: string): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          floorType,
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch floors by type: ${error.message}`);
    }
  }

  /**
   * Find floors by usage
   */
  async findFloorsByUsage(usage: string): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          usage,
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch floors by usage: ${error.message}`);
    }
  }

  /**
   * Find available floors
   */
  async findAvailableFloors(): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          isAvailable: true,
          masterType: MasterType.FLOOR,
          status: 'active'
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch available floors: ${error.message}`);
    }
  }

  /**
   * Find floors in range
   */
  async findFloorsInRange(minFloor: number, maxFloor: number): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          numericValue: { $gte: minFloor, $lte: maxFloor },
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch floors in range: ${error.message}`);
    }
  }

  /**
   * Find basement floors
   */
  async findBasementFloors(): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          numericValue: { $lt: 0 },
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: -1 }) // Sort basement floors from B1 to deeper levels
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch basement floors: ${error.message}`);
    }
  }

  /**
   * Find ground floor
   */
  async findGroundFloor(): Promise<Floor | null> {
    try {
      return await this.floorModel
        .findOne({ 
          numericValue: 0,
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch ground floor: ${error.message}`);
    }
  }

  /**
   * Find upper floors (above ground)
   */
  async findUpperFloors(): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          numericValue: { $gt: 0 },
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch upper floors: ${error.message}`);
    }
  }

  /**
   * Find premium floors (with price multiplier > 1)
   */
  async findPremiumFloors(): Promise<Floor[]> {
    try {
      return await this.floorModel
        .find({ 
          priceMultiplier: { $gt: 1 },
          masterType: MasterType.FLOOR,
          status: { $ne: 'archived' }
        })
        .sort({ priceMultiplier: -1, numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch premium floors: ${error.message}`);
    }
  }

  /**
   * Get floor statistics
   */
  async getFloorStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      // Additional floor-specific statistics
      const [
        floorTypeStats,
        usageStats,
        availabilityStats,
        floorRangeStats,
        averagePriceMultiplier
      ] = await Promise.all([
        this.floorModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.FLOOR,
              status: { $ne: 'archived' },
              floorType: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$floorType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.floorModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.FLOOR,
              status: { $ne: 'archived' },
              usage: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$usage', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.floorModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.FLOOR,
              status: { $ne: 'archived' }
            }
          },
          {
            $group: {
              _id: null,
              available: { $sum: { $cond: ['$isAvailable', 1, 0] } },
              unavailable: { $sum: { $cond: ['$isAvailable', 0, 1] } }
            }
          }
        ]),
        this.floorModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.FLOOR,
              status: { $ne: 'archived' },
              numericValue: { $exists: true, $ne: null }
            }
          },
          {
            $group: {
              _id: null,
              minFloor: { $min: '$numericValue' },
              maxFloor: { $max: '$numericValue' },
              basementCount: { $sum: { $cond: [{ $lt: ['$numericValue', 0] }, 1, 0] } },
              groundCount: { $sum: { $cond: [{ $eq: ['$numericValue', 0] }, 1, 0] } },
              upperCount: { $sum: { $cond: [{ $gt: ['$numericValue', 0] }, 1, 0] } }
            }
          }
        ]),
        this.floorModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.FLOOR,
              priceMultiplier: { $exists: true, $ne: null },
              status: { $ne: 'archived' }
            }
          },
          { 
            $group: { 
              _id: null, 
              avgMultiplier: { $avg: '$priceMultiplier' } 
            } 
          }
        ])
      ]);

      const byFloorType = floorTypeStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byUsage = usageStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        averagePriceMultiplier: averagePriceMultiplier[0]?.avgMultiplier || 1,
        byFloorType,
        byUsage,
        availability: availabilityStats[0] || { available: 0, unavailable: 0 },
        floorRange: floorRangeStats[0] || {
          minFloor: 0,
          maxFloor: 0,
          basementCount: 0,
          groundCount: 0,
          upperCount: 0
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get floor statistics: ${error.message}`);
    }
  }

  /**
   * Check if floor is being used before deletion
   */
  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // Check if floor is being used in projects
    // This would require injecting the ProjectsService
    // For now, we'll implement a basic check
    
    // TODO: Implement proper usage checking with other modules
    // Example:
    // const projectsUsingFloor = await this.projectsService.countByFloor(id);
    // if (projectsUsingFloor > 0) {
    //   throw new BadRequestException('Cannot delete floor as it is being used in projects');
    // }
  }
}
