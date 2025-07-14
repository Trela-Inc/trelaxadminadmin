import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropertyType, PropertyTypeDocument } from './schemas/property-type.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType, PropertyTypeCategory } from '../common/enums/master-types.enum';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { QueryMasterWithCategoryDto } from '../common/dto/query-master.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

@Injectable()
export class PropertyTypesService extends BaseMasterService<PropertyType> {
  constructor(
    @InjectModel(PropertyType.name) private propertyTypeModel: Model<PropertyTypeDocument>
  ) {
    super(propertyTypeModel, MasterType.PROPERTY_TYPE);
  }

  async createPropertyType(createPropertyTypeDto: CreatePropertyTypeDto): Promise<PropertyType> {
    return await this.create(createPropertyTypeDto);
  }

  async findAllPropertyTypes(queryDto: QueryMasterWithCategoryDto = {}): Promise<MasterListResponse<PropertyType>> {
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
        category
      } = queryDto;

      const filter: any = { 
        masterType: MasterType.PROPERTY_TYPE,
        status: { $ne: 'archived' }
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { features: { $regex: search, $options: 'i' } },
          { suitableFor: { $regex: search, $options: 'i' } },
          { targetAudience: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) filter.status = status;
      if (typeof isDefault === 'boolean') filter.isDefault = isDefault;
      if (typeof isPopular === 'boolean') filter.isPopular = isPopular;
      if (category) filter.category = category;

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.propertyTypeModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.propertyTypeModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as PropertyType[],
        pagination: { page, limit, total, totalPages }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch property types: ${error.message}`);
    }
  }

  async findPropertyTypeById(id: string): Promise<PropertyType> {
    return await this.findById(id);
  }

  async updatePropertyType(id: string, updatePropertyTypeDto: UpdatePropertyTypeDto): Promise<PropertyType> {
    return await this.update(id, updatePropertyTypeDto);
  }

  async removePropertyType(id: string): Promise<void> {
    return await this.remove(id);
  }

  async findPropertyTypesByCategory(category: PropertyTypeCategory): Promise<PropertyType[]> {
    try {
      return await this.propertyTypeModel
        .find({ 
          category,
          masterType: MasterType.PROPERTY_TYPE,
          status: { $ne: 'archived' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch property types by category: ${error.message}`);
    }
  }

  async findResidentialPropertyTypes(): Promise<PropertyType[]> {
    return this.findPropertyTypesByCategory(PropertyTypeCategory.RESIDENTIAL);
  }

  async findCommercialPropertyTypes(): Promise<PropertyType[]> {
    return this.findPropertyTypesByCategory(PropertyTypeCategory.COMMERCIAL);
  }

  async getPropertyTypeStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      const [categoryStats, popularityStats, suitabilityStats] = await Promise.all([
        this.propertyTypeModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.PROPERTY_TYPE,
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.propertyTypeModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.PROPERTY_TYPE,
              status: { $ne: 'archived' },
              popularityRating: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$popularityRating', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),
        this.propertyTypeModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.PROPERTY_TYPE,
              status: { $ne: 'archived' },
              suitableFor: { $exists: true, $ne: [] }
            }
          },
          { $unwind: '$suitableFor' },
          { $group: { _id: '$suitableFor', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
      ]);

      const byCategory = categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byPopularityRating = popularityStats.reduce((acc, item) => {
        acc[`rating_${item._id}`] = item.count;
        return acc;
      }, {});

      const bySuitability = suitabilityStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        byCategory,
        byPopularityRating,
        bySuitability
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get property type statistics: ${error.message}`);
    }
  }

  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // TODO: Check if property type is being used in projects
  }
}
