import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Washroom, WashroomDocument } from './schemas/washroom.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType } from '../common/enums/master-types.enum';
import { CreateWashroomDto } from './dto/create-washroom.dto';
import { UpdateWashroomDto } from './dto/update-washroom.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

@Injectable()
export class WashroomsService extends BaseMasterService<Washroom> {
  constructor(
    @InjectModel(Washroom.name) private washroomModel: Model<WashroomDocument>
  ) {
    super(washroomModel, MasterType.WASHROOM);
  }

  async createWashroom(createWashroomDto: CreateWashroomDto): Promise<Washroom> {
    return await this.create(createWashroomDto);
  }

  async findAllWashrooms(queryDto: QueryMasterWithNumericRangeDto = {}): Promise<MasterListResponse<Washroom>> {
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
        masterType: MasterType.WASHROOM,
        status: { $ne: 'archived' }
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { washroomType: { $regex: search, $options: 'i' } },
          { features: { $regex: search, $options: 'i' } }
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
        this.washroomModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.washroomModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as Washroom[],
        pagination: { page, limit, total, totalPages }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch washrooms: ${error.message}`);
    }
  }

  async findWashroomById(id: string): Promise<Washroom> {
    return await this.findById(id);
  }

  async updateWashroom(id: string, updateWashroomDto: UpdateWashroomDto): Promise<Washroom> {
    return await this.update(id, updateWashroomDto);
  }

  async removeWashroom(id: string): Promise<void> {
    return await this.remove(id);
  }

  async findWashroomsByType(washroomType: string): Promise<Washroom[]> {
    try {
      return await this.washroomModel
        .find({ 
          washroomType,
          masterType: MasterType.WASHROOM,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch washrooms by type: ${error.message}`);
    }
  }

  async getWashroomStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      const [washroomTypeStats, popularityStats] = await Promise.all([
        this.washroomModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.WASHROOM,
              status: { $ne: 'archived' },
              washroomType: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$washroomType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.washroomModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.WASHROOM,
              popularityRating: { $exists: true, $ne: null },
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$popularityRating', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ])
      ]);

      const byWashroomType = washroomTypeStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byPopularityRating = popularityStats.reduce((acc, item) => {
        acc[`rating_${item._id}`] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        byWashroomType,
        byPopularityRating
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get washroom statistics: ${error.message}`);
    }
  }

  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // TODO: Check if washroom configuration is being used in projects
  }
}
