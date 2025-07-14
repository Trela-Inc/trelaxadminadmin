import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType } from '../common/enums/master-types.enum';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryMasterWithNumericRangeDto } from '../common/dto/query-master.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

@Injectable()
export class RoomsService extends BaseMasterService<Room> {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>
  ) {
    super(roomModel, MasterType.ROOM);
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.create(createRoomDto);
  }

  async findAllRooms(queryDto: QueryMasterWithNumericRangeDto = {}): Promise<MasterListResponse<Room>> {
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
        masterType: MasterType.ROOM,
        status: { $ne: 'archived' }
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { roomType: { $regex: search, $options: 'i' } },
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
        this.roomModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.roomModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as Room[],
        pagination: { page, limit, total, totalPages }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch rooms: ${error.message}`);
    }
  }

  async findRoomById(id: string): Promise<Room> {
    return await this.findById(id);
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    return await this.update(id, updateRoomDto);
  }

  async removeRoom(id: string): Promise<void> {
    return await this.remove(id);
  }

  async findRoomsByType(roomType: string): Promise<Room[]> {
    try {
      return await this.roomModel
        .find({ 
          roomType,
          masterType: MasterType.ROOM,
          status: { $ne: 'archived' }
        })
        .sort({ numericValue: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch rooms by type: ${error.message}`);
    }
  }

  async getRoomStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      const [roomTypeStats, popularityStats] = await Promise.all([
        this.roomModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.ROOM,
              status: { $ne: 'archived' },
              roomType: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$roomType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.roomModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.ROOM,
              popularityRating: { $exists: true, $ne: null },
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$popularityRating', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ])
      ]);

      const byRoomType = roomTypeStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byPopularityRating = popularityStats.reduce((acc, item) => {
        acc[`rating_${item._id}`] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        byRoomType,
        byPopularityRating
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get room statistics: ${error.message}`);
    }
  }

  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // TODO: Check if room configuration is being used in projects
  }
}
