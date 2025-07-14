import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { City, CityDocument } from './schemas/city.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType } from '../common/enums/master-types.enum';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { QueryCityDto } from './dto/query-city.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

/**
 * Cities Service
 * Handles CRUD operations for city master data
 */
@Injectable()
export class CitiesService extends BaseMasterService<City> {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>
  ) {
    super(cityModel, MasterType.CITY);
  }

  /**
   * Create a new city
   */
  async createCity(createCityDto: CreateCityDto): Promise<City> {
    return await this.create(createCityDto);
  }

  /**
   * Find all cities with advanced filtering
   */
  async findAllCities(queryDto: QueryCityDto = {}): Promise<MasterListResponse<City>> {
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
        state,
        country,
        pinCode,
        stateCode,
        countryCode,
        minPopulation,
        maxPopulation,
        minArea,
        maxArea,
        majorLanguage,
        district,
        division,
        minPropertyPrice,
        maxPropertyPrice,
        minAppreciationRate,
        maxAppreciationRate,
        nearbyAirport,
        highway,
        hasFeaturedImage,
        hasGallery,
        hasRealEstateData,
        hasEconomicData,
        hasClimateData
      } = queryDto;

      // Build filter object
      const filter: any = { 
        masterType: MasterType.CITY,
        status: { $ne: 'archived' }
      };

      // Basic filters
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { alternateNames: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) filter.status = status;
      if (typeof isDefault === 'boolean') filter.isDefault = isDefault;
      if (typeof isPopular === 'boolean') filter.isPopular = isPopular;

      // Location filters
      if (state) filter.state = { $regex: state, $options: 'i' };
      if (country) filter.country = { $regex: country, $options: 'i' };
      if (stateCode) filter.stateCode = stateCode;
      if (countryCode) filter.countryCode = countryCode;
      if (district) filter.district = { $regex: district, $options: 'i' };
      if (division) filter.division = { $regex: division, $options: 'i' };
      if (majorLanguage) filter.majorLanguage = { $regex: majorLanguage, $options: 'i' };

      if (pinCode) {
        filter.pinCodes = { $in: [pinCode] };
      }

      // Numeric range filters
      if (minPopulation !== undefined || maxPopulation !== undefined) {
        filter.population = {};
        if (minPopulation !== undefined) filter.population.$gte = minPopulation;
        if (maxPopulation !== undefined) filter.population.$lte = maxPopulation;
      }

      if (minArea !== undefined || maxArea !== undefined) {
        filter.area = {};
        if (minArea !== undefined) filter.area.$gte = minArea;
        if (maxArea !== undefined) filter.area.$lte = maxArea;
      }

      // Real estate filters
      if (minPropertyPrice !== undefined || maxPropertyPrice !== undefined) {
        filter['realEstateData.averagePropertyPrice'] = {};
        if (minPropertyPrice !== undefined) {
          filter['realEstateData.averagePropertyPrice'].$gte = minPropertyPrice;
        }
        if (maxPropertyPrice !== undefined) {
          filter['realEstateData.averagePropertyPrice'].$lte = maxPropertyPrice;
        }
      }

      if (minAppreciationRate !== undefined || maxAppreciationRate !== undefined) {
        filter['realEstateData.priceAppreciationRate'] = {};
        if (minAppreciationRate !== undefined) {
          filter['realEstateData.priceAppreciationRate'].$gte = minAppreciationRate;
        }
        if (maxAppreciationRate !== undefined) {
          filter['realEstateData.priceAppreciationRate'].$lte = maxAppreciationRate;
        }
      }

      // Array filters
      if (nearbyAirport) {
        filter.nearbyAirports = { $in: [nearbyAirport] };
      }

      if (highway) {
        filter.highways = { $in: [highway] };
      }

      // Existence filters
      if (hasFeaturedImage) {
        filter.featuredImage = { $exists: true, $nin: [null, ''] };
      }

      if (hasGallery) {
        filter.gallery = { $exists: true, $not: { $size: 0 } };
      }

      if (hasRealEstateData) {
        filter.realEstateData = { $exists: true, $ne: null };
      }

      if (hasEconomicData) {
        filter.economicData = { $exists: true, $ne: null };
      }

      if (hasClimateData) {
        filter.climateData = { $exists: true, $ne: null };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [data, total] = await Promise.all([
        this.cityModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.cityModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as City[],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch cities: ${error.message}`);
    }
  }

  /**
   * Find city by ID
   */
  async findCityById(id: string): Promise<City> {
    return await this.findById(id);
  }

  /**
   * Update city by ID
   */
  async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    return await this.update(id, updateCityDto);
  }

  /**
   * Delete city by ID
   */
  async removeCity(id: string): Promise<void> {
    return await this.remove(id);
  }

  /**
   * Find cities by state
   */
  async findCitiesByState(state: string): Promise<City[]> {
    try {
      return await this.cityModel
        .find({ 
          state: { $regex: state, $options: 'i' },
          masterType: MasterType.CITY,
          status: { $ne: 'archived' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch cities by state: ${error.message}`);
    }
  }

  /**
   * Find cities by country
   */
  async findCitiesByCountry(country: string): Promise<City[]> {
    try {
      return await this.cityModel
        .find({ 
          country: { $regex: country, $options: 'i' },
          masterType: MasterType.CITY,
          status: { $ne: 'archived' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch cities by country: ${error.message}`);
    }
  }

  /**
   * Find popular cities
   */
  async findPopularCities(limit: number = 10): Promise<City[]> {
    try {
      return await this.cityModel
        .find({ 
          isPopular: true,
          masterType: MasterType.CITY,
          status: 'active'
        })
        .sort({ sortOrder: 1, name: 1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch popular cities: ${error.message}`);
    }
  }

  /**
   * Find cities near coordinates
   */
  async findCitiesNearLocation(
    longitude: number, 
    latitude: number, 
    maxDistance: number = 100000 // 100km in meters
  ): Promise<City[]> {
    try {
      return await this.cityModel
        .find({
          coordinates: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
              },
              $maxDistance: maxDistance
            }
          },
          masterType: MasterType.CITY,
          status: { $ne: 'archived' }
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to find cities near location: ${error.message}`);
    }
  }

  /**
   * Get city statistics
   */
  async getCityStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      // Additional city-specific statistics
      const [
        stateStats,
        countryStats,
        popularCitiesCount,
        citiesWithRealEstateData,
        averagePropertyPrice
      ] = await Promise.all([
        this.cityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.CITY,
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$state', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.cityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.CITY,
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$country', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.cityModel.countDocuments({
          masterType: MasterType.CITY,
          isPopular: true,
          status: 'active'
        }),
        this.cityModel.countDocuments({
          masterType: MasterType.CITY,
          'realEstateData.averagePropertyPrice': { $exists: true, $ne: null },
          status: { $ne: 'archived' }
        }),
        this.cityModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.CITY,
              'realEstateData.averagePropertyPrice': { $exists: true, $ne: null },
              status: { $ne: 'archived' }
            }
          },
          { 
            $group: { 
              _id: null, 
              avgPrice: { $avg: '$realEstateData.averagePropertyPrice' } 
            } 
          }
        ])
      ]);

      const byState = stateStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byCountry = countryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return {
        ...baseStats,
        popularCitiesCount,
        citiesWithRealEstateData,
        averagePropertyPrice: averagePropertyPrice[0]?.avgPrice || 0,
        byState,
        byCountry
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get city statistics: ${error.message}`);
    }
  }

  /**
   * Check if city is being used before deletion
   */
  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // Check if city is being used in projects
    // This would require injecting the ProjectsService
    // For now, we'll implement a basic check
    
    // TODO: Implement proper usage checking with other modules
    // Example:
    // const projectsUsingCity = await this.projectsService.countByCity(id);
    // if (projectsUsingCity > 0) {
    //   throw new BadRequestException('Cannot delete city as it is being used in projects');
    // }
  }
}
