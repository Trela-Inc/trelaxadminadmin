import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tower, TowerDocument } from './schemas/tower.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType } from '../common/enums/master-types.enum';
import { CreateTowerDto } from './dto/create-tower.dto';
import { UpdateTowerDto } from './dto/update-tower.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

@Injectable()
export class TowersService extends BaseMasterService<Tower> {
  constructor(
    @InjectModel(Tower.name) private towerModel: Model<TowerDocument>
  ) {
    super(towerModel, MasterType.TOWER);
  }

  async createTower(createTowerDto: CreateTowerDto): Promise<Tower> {
    return await this.create(createTowerDto);
  }

  async findAllTowers(queryDto: QueryMasterWithNumericRangeDto = {}): Promise<MasterListResponse<Tower>> {
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

      const filter: any = { 
        masterType: MasterType.TOWER,
        status: { $ne: 'archived' }
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { features: { $regex: search, $options: 'i' } },
          { amenities: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) filter.status = status;
      if (typeof isDefault === 'boolean') filter.isDefault = isDefault;
      if (typeof isPopular === 'boolean') filter.isPopular = isPopular;
      if (unit) filter.unit = unit;

      if (minValue !== undefined || maxValue !== undefined) {
        filter.numericValue = {};
        if (minValue !== undefined) filter.numericValue.$gte = minValue;
        if (maxValue !== undefined) filter.numericValue.$lte = maxValue;
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.towerModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.towerModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as Tower[],
        pagination: { page, limit, total, totalPages }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch towers: ${error.message}`);
    }
  }

  async findTowerById(id: string): Promise<Tower> {
    return await this.findById(id);
  }

  async updateTower(id: string, updateTowerDto: UpdateTowerDto): Promise<Tower> {
    return await this.update(id, updateTowerDto);
  }

  async removeTower(id: string): Promise<void> {
    return await this.remove(id);
  }

  async findTowersByType(towerType: string): Promise<Tower[]> {
    try {
      return await this.towerModel
        .find({ 
          towerType,
          masterType: MasterType.TOWER,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch towers by type: ${error.message}`);
    }
  }

  async findActiveTowers(): Promise<Tower[]> {
    try {
      return await this.towerModel
        .find({ 
          isActive: true,
          masterType: MasterType.TOWER,
          status: 'active'
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch active towers: ${error.message}`);
    }
  }

  async getTowerStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      const [towerTypeStats, activeTowersCount, totalUnitsSum] = await Promise.all([
        this.towerModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.TOWER,
              status: { $ne: 'archived' },
              towerType: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$towerType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.towerModel.countDocuments({
          masterType: MasterType.TOWER,
          isActive: true,
          status: 'active'
        }),
        this.towerModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.TOWER,
              totalUnits: { $exists: true, $ne: null },
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: null, totalUnits: { $sum: '$totalUnits' } } }
        ])
      ]);

      const byTowerType = towerTypeStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        activeTowersCount,
        totalUnitsAcrossAllTowers: totalUnitsSum[0]?.totalUnits || 0,
        byTowerType
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get tower statistics: ${error.message}`);
    }
  }

  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // TODO: Check if tower is being used in projects
  }
}
