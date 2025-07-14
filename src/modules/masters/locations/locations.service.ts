import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
import { BaseMasterService } from '../common/services/base-master.service';
import { MasterType } from '../common/enums/master-types.enum';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryLocationDto } from './dto/query-location.dto';
import { MasterListResponse } from '../common/interfaces/base-master.interface';

/**
 * Locations Service
 * Handles CRUD operations for location master data
 */
@Injectable()
export class LocationsService extends BaseMasterService<Location> {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>
  ) {
    super(locationModel, MasterType.LOCATION);
  }

  /**
   * Create a new location
   */
  async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
    // Validate that parent city exists
    const parentCityId = createLocationDto.parentId || createLocationDto.cityId;
    await this.validateParentCity(parentCityId);

    // Map DTO to Location schema format
    const locationData: any = {
      ...createLocationDto,
      parentId: new Types.ObjectId(parentCityId),
      parentType: MasterType.CITY,
      masterType: MasterType.LOCATION
    };

    // Remove cityId from the data as it's not part of the schema
    delete locationData.cityId;

    return await this.create(locationData);
  }

  /**
   * Find all locations with advanced filtering
   */
  async findAllLocations(queryDto: QueryLocationDto = {}): Promise<MasterListResponse<Location>> {
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
        cityId,
        locationType,
        locationCategory,
        pincode,
        minPropertyPrice,
        maxPropertyPrice,
        minAppreciationRate,
        maxAppreciationRate,
        minRentalYield,
        maxRentalYield,
        nearbyMetroStation,
        maxMetroDistance,
        nearbyRailwayStation,
        maxRailwayDistance,
        maxAirportDistance,
        propertyType,
        hasConnectivity,
        hasRealEstateData,
        hasNearbyFacilities,
        hasFeaturedImage,
        hasGallery
      } = queryDto;

      // Build filter object
      const filter: any = { 
        masterType: MasterType.LOCATION,
        status: { $ne: 'archived' }
      };

      // Basic filters
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { landmark: { $regex: search, $options: 'i' } },
          { alternateNames: { $regex: search, $options: 'i' } }
        ];
      }

      if (status) filter.status = status;
      if (typeof isDefault === 'boolean') filter.isDefault = isDefault;
      if (typeof isPopular === 'boolean') filter.isPopular = isPopular;

      // Parent filters
      if (parentId || cityId) {
        filter.parentId = new Types.ObjectId(parentId || cityId);
      }

      // Location specific filters
      if (locationType) filter.locationType = locationType;
      if (locationCategory) filter.locationCategory = locationCategory;
      if (pincode) filter.pincode = pincode;

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

      if (minRentalYield !== undefined || maxRentalYield !== undefined) {
        filter['realEstateData.rentalYield'] = {};
        if (minRentalYield !== undefined) {
          filter['realEstateData.rentalYield'].$gte = minRentalYield;
        }
        if (maxRentalYield !== undefined) {
          filter['realEstateData.rentalYield'].$lte = maxRentalYield;
        }
      }

      // Connectivity filters
      if (nearbyMetroStation) {
        filter['connectivity.nearestMetroStation'] = { $regex: nearbyMetroStation, $options: 'i' };
      }

      if (maxMetroDistance !== undefined) {
        filter['connectivity.metroDistance'] = { $lte: maxMetroDistance };
      }

      if (nearbyRailwayStation) {
        filter['connectivity.nearestRailwayStation'] = { $regex: nearbyRailwayStation, $options: 'i' };
      }

      if (maxRailwayDistance !== undefined) {
        filter['connectivity.railwayDistance'] = { $lte: maxRailwayDistance };
      }

      if (maxAirportDistance !== undefined) {
        filter['connectivity.airportDistance'] = { $lte: maxAirportDistance };
      }

      // Property type filter
      if (propertyType) {
        filter['realEstateData.popularPropertyTypes'] = { $in: [propertyType] };
      }

      // Existence filters
      if (hasConnectivity) {
        filter.connectivity = { $exists: true, $ne: null };
      }

      if (hasRealEstateData) {
        filter.realEstateData = { $exists: true, $ne: null };
      }

      if (hasNearbyFacilities) {
        filter.nearbyFacilities = { $exists: true, $ne: null };
      }

      if (hasFeaturedImage) {
        filter.featuredImage = { $exists: true, $nin: [null, ''] };
      }

      if (hasGallery) {
        filter.gallery = { $exists: true, $not: { $size: 0 } };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [data, total] = await Promise.all([
        this.locationModel
          .find(filter)
          .populate('parentId', 'name masterType state country')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.locationModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: data as Location[],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch locations: ${error.message}`);
    }
  }

  /**
   * Find location by ID
   */
  async findLocationById(id: string): Promise<Location> {
    try {
      const location = await this.locationModel
        .findOne({ 
          _id: id, 
          masterType: MasterType.LOCATION,
          status: { $ne: 'archived' }
        })
        .populate('parentId', 'name masterType state country')
        .exec();

      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }

      return location as Location;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Invalid location ID: ${error.message}`);
    }
  }

  /**
   * Update location by ID
   */
  async updateLocation(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    // Validate parent city if being updated
    const parentId = updateLocationDto.parentId || updateLocationDto.cityId;
    if (parentId) {
      await this.validateParentCity(parentId);
    }

    // Map DTO to Location schema format
    const updateData: any = { ...updateLocationDto };

    if (parentId) {
      updateData.parentId = new Types.ObjectId(parentId);
      updateData.parentType = MasterType.CITY;
    }

    // Remove cityId from the data as it's not part of the schema
    delete updateData.cityId;

    return await this.update(id, updateData);
  }

  /**
   * Delete location by ID
   */
  async removeLocation(id: string): Promise<void> {
    return await this.remove(id);
  }

  /**
   * Find locations by city ID
   */
  async findLocationsByCity(cityId: string): Promise<Location[]> {
    try {
      return await this.locationModel
        .find({ 
          parentId: new Types.ObjectId(cityId),
          masterType: MasterType.LOCATION,
          status: { $ne: 'archived' }
        })
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch locations by city: ${error.message}`);
    }
  }

  /**
   * Find popular locations
   */
  async findPopularLocations(limit: number = 10): Promise<Location[]> {
    try {
      return await this.locationModel
        .find({ 
          isPopular: true,
          masterType: MasterType.LOCATION,
          status: 'active'
        })
        .populate('parentId', 'name masterType')
        .sort({ sortOrder: 1, name: 1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch popular locations: ${error.message}`);
    }
  }

  /**
   * Find locations by type
   */
  async findLocationsByType(locationType: string): Promise<Location[]> {
    try {
      return await this.locationModel
        .find({ 
          locationType,
          masterType: MasterType.LOCATION,
          status: { $ne: 'archived' }
        })
        .populate('parentId', 'name masterType')
        .sort({ sortOrder: 1, name: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to fetch locations by type: ${error.message}`);
    }
  }

  /**
   * Find locations near coordinates
   */
  async findLocationsNearLocation(
    longitude: number, 
    latitude: number, 
    maxDistance: number = 50000 // 50km in meters
  ): Promise<Location[]> {
    try {
      return await this.locationModel
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
          masterType: MasterType.LOCATION,
          status: { $ne: 'archived' }
        })
        .populate('parentId', 'name masterType')
        .exec();
    } catch (error) {
      throw new BadRequestException(`Failed to find locations near location: ${error.message}`);
    }
  }

  /**
   * Get location statistics
   */
  async getLocationStatistics() {
    try {
      const baseStats = await this.getStatistics();
      
      // Additional location-specific statistics
      const [
        locationTypeStats,
        locationCategoryStats,
        cityStats,
        locationsWithRealEstateData,
        averagePropertyPrice
      ] = await Promise.all([
        this.locationModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.LOCATION,
              status: { $ne: 'archived' },
              locationType: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$locationType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.locationModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.LOCATION,
              status: { $ne: 'archived' },
              locationCategory: { $exists: true, $ne: null }
            }
          },
          { $group: { _id: '$locationCategory', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.locationModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.LOCATION,
              status: { $ne: 'archived' }
            }
          },
          { $group: { _id: '$parentId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        this.locationModel.countDocuments({
          masterType: MasterType.LOCATION,
          'realEstateData.averagePropertyPrice': { $exists: true, $ne: null },
          status: { $ne: 'archived' }
        }),
        this.locationModel.aggregate([
          { 
            $match: { 
              masterType: MasterType.LOCATION,
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

      const byLocationType = locationTypeStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const byLocationCategory = locationCategoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const topCitiesByLocationCount = cityStats.map(item => ({
        cityId: item._id,
        locationCount: item.count
      }));

      return {
        ...baseStats,
        locationsWithRealEstateData,
        averagePropertyPrice: averagePropertyPrice[0]?.avgPrice || 0,
        byLocationType,
        byLocationCategory,
        topCitiesByLocationCount
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get location statistics: ${error.message}`);
    }
  }

  /**
   * Validate that parent city exists
   */
  private async validateParentCity(cityId: string): Promise<void> {
    try {
      const cityExists = await this.locationModel.db.collection('masters').findOne({
        _id: new Types.ObjectId(cityId),
        masterType: MasterType.CITY,
        status: { $ne: 'archived' }
      });

      if (!cityExists) {
        throw new BadRequestException(`Parent city with ID ${cityId} not found or inactive`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to validate parent city: ${error.message}`);
    }
  }

  /**
   * Check if location is being used before deletion
   */
  protected async checkUsageBeforeDelete(id: string): Promise<void> {
    // Check if location is being used in projects
    // This would require injecting the ProjectsService
    // For now, we'll implement a basic check
    
    // TODO: Implement proper usage checking with other modules
    // Example:
    // const projectsUsingLocation = await this.projectsService.countByLocation(id);
    // if (projectsUsingLocation > 0) {
    //   throw new BadRequestException('Cannot delete location as it is being used in projects');
    // }
  }
}
