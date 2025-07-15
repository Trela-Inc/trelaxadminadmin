import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

// Import all schemas
import { City, CityDocument } from '../../modules/masters/cities/schemas/city.schema';
import { Location, LocationDocument } from '../../modules/masters/locations/schemas/location.schema';
import { Amenity, AmenityDocument } from '../../modules/masters/amenities/schemas/amenity.schema';
import { Floor, FloorDocument } from '../../modules/masters/floors/schemas/floor.schema';
import { Tower, TowerDocument } from '../../modules/masters/towers/schemas/tower.schema';
import { PropertyType, PropertyTypeDocument } from '../../modules/masters/property-types/schemas/property-type.schema';
import { Room, RoomDocument } from '../../modules/masters/rooms/schemas/room.schema';
import { Washroom, WashroomDocument } from '../../modules/masters/washrooms/schemas/washroom.schema';
import { Project, ProjectDocument } from '../../modules/projects/schemas/project.schema';
import { Builder, BuilderDocument } from '../../modules/builders/schemas/builder.schema';
import { Agent, AgentDocument } from '../../modules/agents/schemas/agent.schema';

// Import enums
import { MasterType, MasterStatus, AmenityCategory } from '../../modules/masters/common/enums/master-types.enum';
import { ProjectStatus, PropertyType as PropertyTypeEnum, UnitType, PossessionStatus, ApprovalStatus } from '../../modules/projects/enums/project-status.enum';

@Injectable()
export class ComprehensiveSeeder {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    @InjectModel(Amenity.name) private amenityModel: Model<AmenityDocument>,
    @InjectModel(Floor.name) private floorModel: Model<FloorDocument>,
    @InjectModel(Tower.name) private towerModel: Model<TowerDocument>,
    @InjectModel(PropertyType.name) private propertyTypeModel: Model<PropertyTypeDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Washroom.name) private washroomModel: Model<WashroomDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Builder.name) private builderModel: Model<BuilderDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  /**
   * Seed all data
   */
  async seedAll(): Promise<void> {
    console.log('🌱 Starting comprehensive database seeding...');

    try {
      // Clear existing data
      await this.clearDatabase();

      // Seed master data first (dependencies)
      const cities = await this.seedCities();
      const locations = await this.seedLocations(cities);
      const amenities = await this.seedAmenities();
      const floors = await this.seedFloors();
      const towers = await this.seedTowers();
      const propertyTypes = await this.seedPropertyTypes();
      const rooms = await this.seedRooms();
      const washrooms = await this.seedWashrooms();

      // Seed business entities
      const builders = await this.seedBuilders();
      const agents = await this.seedAgents();

      // Seed projects (depends on all above)
      await this.seedProjects(cities, locations, amenities, builders);

      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  /**
   * Clear all existing data
   */
  private async clearDatabase(): Promise<void> {
    console.log('🧹 Clearing existing data...');
    
    await Promise.all([
      this.projectModel.deleteMany({}),
      this.builderModel.deleteMany({}),
      this.agentModel.deleteMany({}),
      this.cityModel.deleteMany({}),
      this.locationModel.deleteMany({}),
      this.amenityModel.deleteMany({}),
      this.floorModel.deleteMany({}),
      this.towerModel.deleteMany({}),
      this.propertyTypeModel.deleteMany({}),
      this.roomModel.deleteMany({}),
      this.washroomModel.deleteMany({}),
    ]);

    console.log('✅ Database cleared');
  }

  /**
   * Seed cities
   */
  private async seedCities(): Promise<CityDocument[]> {
    console.log('🏙️ Seeding cities...');

    const indianCities = [
      { name: 'Mumbai', state: 'Maharashtra', coordinates: [72.8777, 19.0760] },
      { name: 'Delhi', state: 'Delhi', coordinates: [77.1025, 28.7041] },
      { name: 'Bangalore', state: 'Karnataka', coordinates: [77.5946, 12.9716] },
      { name: 'Hyderabad', state: 'Telangana', coordinates: [78.4867, 17.3850] },
      { name: 'Chennai', state: 'Tamil Nadu', coordinates: [80.2707, 13.0827] },
      { name: 'Kolkata', state: 'West Bengal', coordinates: [88.3639, 22.5726] },
      { name: 'Pune', state: 'Maharashtra', coordinates: [73.8567, 18.5204] },
      { name: 'Ahmedabad', state: 'Gujarat', coordinates: [72.5714, 23.0225] },
      { name: 'Jaipur', state: 'Rajasthan', coordinates: [75.7873, 26.9124] },
      { name: 'Surat', state: 'Gujarat', coordinates: [72.8311, 21.1702] },
      { name: 'Lucknow', state: 'Uttar Pradesh', coordinates: [80.9462, 26.8467] },
      { name: 'Kanpur', state: 'Uttar Pradesh', coordinates: [80.3319, 26.4499] },
      { name: 'Nagpur', state: 'Maharashtra', coordinates: [79.0882, 21.1458] },
      { name: 'Indore', state: 'Madhya Pradesh', coordinates: [75.8577, 22.7196] },
      { name: 'Thane', state: 'Maharashtra', coordinates: [72.9781, 19.2183] },
      { name: 'Bhopal', state: 'Madhya Pradesh', coordinates: [77.4126, 23.2599] },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', coordinates: [83.3018, 17.6868] },
      { name: 'Pimpri-Chinchwad', state: 'Maharashtra', coordinates: [73.8067, 18.6298] },
      { name: 'Patna', state: 'Bihar', coordinates: [85.1376, 25.5941] },
      { name: 'Vadodara', state: 'Gujarat', coordinates: [73.1812, 22.3072] },
    ];

    const cities: CityDocument[] = [];

    for (const cityData of indianCities) {
      const city = new this.cityModel({
        name: cityData.name,
        masterType: MasterType.CITY,
        status: MasterStatus.ACTIVE,
        state: cityData.state,
        country: 'India',
        coordinates: cityData.coordinates,
        timezone: 'Asia/Kolkata',
        pinCodes: this.generatePinCodes(),
        isPopular: Math.random() > 0.3,
        sortOrder: cities.length + 1,
        metadata: {
          population: faker.number.int({ min: 500000, max: 20000000 }),
          area: faker.number.int({ min: 100, max: 4000 }),
          language: this.getStateLanguage(cityData.state),
          climate: faker.helpers.arrayElement(['tropical', 'subtropical', 'arid', 'temperate']),
        }
      });

      cities.push(await city.save());
    }

    console.log(`✅ Seeded ${cities.length} cities`);
    return cities;
  }

  /**
   * Seed locations for cities
   */
  private async seedLocations(cities: CityDocument[]): Promise<LocationDocument[]> {
    console.log('📍 Seeding locations...');

    const locations: LocationDocument[] = [];

    for (const city of cities) {
      const locationCount = faker.number.int({ min: 8, max: 15 });
      const cityLocationCodes = new Set<string>(); // Track codes for this city

      for (let i = 0; i < locationCount; i++) {
        const locationName = this.generateLocationName(city.name);
        const locationCode = this.generateUniqueLocationCode(city.name, cityLocationCodes);

        // Check if location already exists to ensure idempotency
        const existingLocation = await this.locationModel.findOne({
          name: locationName,
          parentId: city._id
        });

        if (existingLocation) {
          console.log(`⚠️  Location "${locationName}" already exists in ${city.name}, skipping...`);
          locations.push(existingLocation);
          continue;
        }

        const locationData = {
          name: locationName,
          masterType: MasterType.LOCATION,
          status: MasterStatus.ACTIVE,
          parentId: city._id,
          parentType: MasterType.CITY,
          locationCode, // Always provide a unique locationCode
          coordinates: this.generateNearbyCoordinates(city.coordinates),
          isPopular: Math.random() > 0.4,
          sortOrder: i + 1,
          locationType: faker.helpers.arrayElement(['residential', 'commercial', 'mixed', 'industrial']),
          locationCategory: faker.helpers.arrayElement(['prime', 'premium', 'mid_range', 'budget']),
          address: faker.location.streetAddress(),
          pincode: faker.location.zipCode('######'),
          landmark: `Near ${faker.helpers.arrayElement(['Metro Station', 'Shopping Mall', 'Hospital', 'School', 'IT Park'])}`,
          metadata: {
            cityName: city.name,
            locationType: faker.helpers.arrayElement(['residential', 'commercial', 'mixed', 'industrial']),
            connectivity: faker.helpers.arrayElements(['metro', 'bus', 'railway', 'airport'], { min: 1, max: 3 }),
            averagePrice: faker.number.int({ min: 3000, max: 25000 }),
          }
        };

        try {
          const location = new this.locationModel(locationData);
          const savedLocation = await location.save();
          locations.push(savedLocation);

          // Track the used location code
          cityLocationCodes.add(locationCode);

        } catch (error) {
          console.error(`❌ Error creating location "${locationName}" in ${city.name}:`, error.message);

          // If it's a duplicate key error, try with a different code
          if (error.code === 11000) {
            console.log(`🔄 Retrying with different location code...`);
            const retryLocationCode = this.generateUniqueLocationCode(city.name, cityLocationCodes, true);

            try {
              const retryLocationData = {
                ...locationData,
                locationCode: retryLocationCode
              };

              const retryLocation = new this.locationModel(retryLocationData);
              const savedRetryLocation = await retryLocation.save();
              locations.push(savedRetryLocation);
              cityLocationCodes.add(retryLocationCode);

            } catch (retryError) {
              console.error(`❌ Retry failed for location "${locationName}":`, retryError.message);
              // Skip this location and continue
            }
          }
        }
      }
    }

    console.log(`✅ Seeded ${locations.length} locations`);
    return locations;
  }

  /**
   * Seed amenities
   */
  private async seedAmenities(): Promise<AmenityDocument[]> {
    console.log('🏊 Seeding amenities...');

    const amenitiesData = [
      // Sports & Recreation
      { name: 'Swimming Pool', category: AmenityCategory.SPORTS, icon: 'pool', importance: 5 },
      { name: 'Gymnasium', category: AmenityCategory.SPORTS, icon: 'gym', importance: 4 },
      { name: 'Tennis Court', category: AmenityCategory.SPORTS, icon: 'tennis', importance: 3 },
      { name: 'Basketball Court', category: AmenityCategory.SPORTS, icon: 'basketball', importance: 3 },
      { name: 'Badminton Court', category: AmenityCategory.SPORTS, icon: 'badminton', importance: 3 },
      { name: 'Jogging Track', category: AmenityCategory.SPORTS, icon: 'track', importance: 4 },
      { name: 'Yoga Studio', category: AmenityCategory.SPORTS, icon: 'yoga', importance: 3 },
      { name: 'Cricket Pitch', category: AmenityCategory.SPORTS, icon: 'cricket', importance: 2 },

      // Security
      { name: '24/7 Security', category: AmenityCategory.SECURITY, icon: 'security', importance: 5 },
      { name: 'CCTV Surveillance', category: AmenityCategory.SECURITY, icon: 'cctv', importance: 5 },
      { name: 'Intercom System', category: AmenityCategory.SECURITY, icon: 'intercom', importance: 4 },
      { name: 'Access Control', category: AmenityCategory.SECURITY, icon: 'access', importance: 4 },
      { name: 'Fire Safety', category: AmenityCategory.SECURITY, icon: 'fire', importance: 5 },

      // Convenience
      { name: 'Elevator', category: AmenityCategory.CONVENIENCE, icon: 'elevator', importance: 5 },
      { name: 'Power Backup', category: AmenityCategory.CONVENIENCE, icon: 'power', importance: 5 },
      { name: 'Water Supply', category: AmenityCategory.CONVENIENCE, icon: 'water', importance: 5 },
      { name: 'Parking', category: AmenityCategory.CONVENIENCE, icon: 'parking', importance: 5 },
      { name: 'Maintenance Service', category: AmenityCategory.CONVENIENCE, icon: 'maintenance', importance: 4 },

      // Community
      { name: 'Clubhouse', category: AmenityCategory.COMMUNITY, icon: 'club', importance: 4 },
      { name: 'Party Hall', category: AmenityCategory.COMMUNITY, icon: 'party', importance: 3 },
      { name: 'Library', category: AmenityCategory.COMMUNITY, icon: 'library', importance: 2 },
      { name: 'Game Room', category: AmenityCategory.RECREATIONAL, icon: 'games', importance: 3 },
      { name: 'Home Theater', category: AmenityCategory.RECREATIONAL, icon: 'theater', importance: 2 },

      // Wellness
      { name: 'Spa', category: AmenityCategory.WELLNESS, icon: 'spa', importance: 2 },
      { name: 'Sauna', category: AmenityCategory.WELLNESS, icon: 'sauna', importance: 2 },
      { name: 'Meditation Center', category: AmenityCategory.WELLNESS, icon: 'meditation', importance: 2 },

      // Recreational
      { name: 'Garden', category: AmenityCategory.RECREATIONAL, icon: 'garden', importance: 4 },
      { name: 'Children\'s Play Area', category: AmenityCategory.RECREATIONAL, icon: 'playground', importance: 4 },
      { name: 'BBQ Area', category: AmenityCategory.RECREATIONAL, icon: 'bbq', importance: 2 },
      { name: 'Terrace Garden', category: AmenityCategory.RECREATIONAL, icon: 'terrace', importance: 3 },
    ];

    const amenities: AmenityDocument[] = [];

    for (const amenityData of amenitiesData) {
      const amenity = new this.amenityModel({
        name: amenityData.name,
        masterType: MasterType.AMENITY,
        status: MasterStatus.ACTIVE,
        category: amenityData.category,
        icon: amenityData.icon,
        importanceLevel: amenityData.importance,
        popularityScore: faker.number.int({ min: 20, max: 95 }),
        isPopular: amenityData.importance >= 4,
        sortOrder: amenities.length + 1,
        description: `${amenityData.name} facility for residents`,
        tags: this.generateAmenityTags(amenityData.name),
        availability: {
          residential: true,
          commercial: Math.random() > 0.5,
          luxury: amenityData.importance >= 4,
          basic: amenityData.importance >= 4,
        },
        specifications: {
          operatingHours: faker.helpers.arrayElement(['24/7', '6 AM - 10 PM', '5 AM - 11 PM', '6 AM - 9 PM']),
          maintenanceFee: faker.number.int({ min: 500, max: 5000 }),
        },
        keywords: this.generateAmenityKeywords(amenityData.name),
      });

      amenities.push(await amenity.save());
    }

    console.log(`✅ Seeded ${amenities.length} amenities`);
    return amenities;
  }

  // Helper methods
  private generatePinCodes(): string[] {
    const count = faker.number.int({ min: 5, max: 15 });
    const pinCodes: string[] = [];
    for (let i = 0; i < count; i++) {
      pinCodes.push(faker.location.zipCode('######'));
    }
    return pinCodes;
  }

  private getStateLanguage(state: string): string {
    const languages: Record<string, string> = {
      'Maharashtra': 'Marathi',
      'Delhi': 'Hindi',
      'Karnataka': 'Kannada',
      'Telangana': 'Telugu',
      'Tamil Nadu': 'Tamil',
      'West Bengal': 'Bengali',
      'Gujarat': 'Gujarati',
      'Rajasthan': 'Hindi',
      'Uttar Pradesh': 'Hindi',
      'Madhya Pradesh': 'Hindi',
      'Andhra Pradesh': 'Telugu',
      'Bihar': 'Hindi',
    };
    return languages[state] || 'Hindi';
  }

  private generateLocationName(cityName: string): string {
    const prefixes = ['New', 'Old', 'East', 'West', 'North', 'South', 'Central'];
    const suffixes = ['Nagar', 'Colony', 'Park', 'Gardens', 'Heights', 'Plaza', 'Residency', 'Enclave'];

    if (Math.random() > 0.5) {
      return `${faker.helpers.arrayElement(prefixes)} ${faker.person.lastName()} ${faker.helpers.arrayElement(suffixes)}`;
    } else {
      return `${faker.person.lastName()} ${faker.helpers.arrayElement(suffixes)}`;
    }
  }

  private generateUniqueLocationCode(cityName: string, usedCodes: Set<string>, isRetry: boolean = false): string {
    const cityPrefix = cityName.substring(0, 3).toUpperCase();
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      let locationCode: string;

      if (isRetry || attempts > 10) {
        // For retries or after many attempts, use a more unique approach
        locationCode = `${cityPrefix}${faker.string.alphanumeric(4).toUpperCase()}`;
      } else {
        // Normal approach: city prefix + random number
        const randomNum = faker.number.int({ min: 100, max: 999 });
        locationCode = `${cityPrefix}${randomNum}`;
      }

      if (!usedCodes.has(locationCode)) {
        return locationCode;
      }

      attempts++;
    }

    // Fallback: use timestamp-based code
    const timestamp = Date.now().toString().slice(-4);
    return `${cityPrefix}${timestamp}`;
  }

  private generateNearbyCoordinates(baseCoords: [number, number]): [number, number] {
    const [baseLng, baseLat] = baseCoords;
    const offset = 0.1; // Roughly 10km radius
    
    return [
      baseLng + (Math.random() - 0.5) * offset,
      baseLat + (Math.random() - 0.5) * offset
    ];
  }

  private generateAmenityTags(name: string): string[] {
    const baseTags = name.toLowerCase().split(' ');
    const additionalTags = ['facility', 'amenity', 'service'];
    return [...baseTags, ...faker.helpers.arrayElements(additionalTags, { min: 1, max: 2 })];
  }

  private generateAmenityKeywords(name: string): string[] {
    const baseKeywords = name.toLowerCase().split(' ');
    const relatedKeywords = {
      'swimming': ['pool', 'water', 'swim', 'aquatic'],
      'gym': ['fitness', 'workout', 'exercise', 'health'],
      'security': ['safety', 'guard', 'protection', 'surveillance'],
      'parking': ['car', 'vehicle', 'garage', 'space'],
      'garden': ['green', 'plants', 'nature', 'outdoor'],
    };

    let keywords = [...baseKeywords];
    for (const [key, values] of Object.entries(relatedKeywords)) {
      if (name.toLowerCase().includes(key)) {
        keywords.push(...values);
      }
    }

    return keywords;
  }

  /**
   * Seed floors
   */
  private async seedFloors(): Promise<FloorDocument[]> {
    console.log('🏢 Seeding floors...');

    const floorsData = [
      { name: 'Basement 2', numericValue: -2, type: 'basement' },
      { name: 'Basement 1', numericValue: -1, type: 'basement' },
      { name: 'Ground Floor', numericValue: 0, type: 'ground' },
      { name: '1st Floor', numericValue: 1, type: 'upper' },
      { name: '2nd Floor', numericValue: 2, type: 'upper' },
      { name: '3rd Floor', numericValue: 3, type: 'upper' },
      { name: '4th Floor', numericValue: 4, type: 'upper' },
      { name: '5th Floor', numericValue: 5, type: 'upper' },
      { name: '10th Floor', numericValue: 10, type: 'upper' },
      { name: '15th Floor', numericValue: 15, type: 'upper' },
      { name: '20th Floor', numericValue: 20, type: 'premium' },
      { name: '25th Floor', numericValue: 25, type: 'premium' },
      { name: '30th Floor', numericValue: 30, type: 'premium' },
      { name: 'Penthouse', numericValue: 35, type: 'premium' },
    ];

    const floors: FloorDocument[] = [];

    for (const floorData of floorsData) {
      const floor = new this.floorModel({
        name: floorData.name,
        masterType: MasterType.FLOOR,
        status: MasterStatus.ACTIVE,
        numericValue: floorData.numericValue,
        sortOrder: floors.length + 1,
        isPopular: floorData.numericValue >= 0 && floorData.numericValue <= 10,
        metadata: {
          type: floorData.type,
          usage: faker.helpers.arrayElement(['residential', 'commercial', 'mixed']),
          premium: floorData.type === 'premium',
        }
      });

      floors.push(await floor.save());
    }

    console.log(`✅ Seeded ${floors.length} floors`);
    return floors;
  }

  /**
   * Seed towers
   */
  private async seedTowers(): Promise<TowerDocument[]> {
    console.log('🏗️ Seeding towers...');

    const towersData = [
      { name: 'Tower A', numericValue: 1 },
      { name: 'Tower B', numericValue: 2 },
      { name: 'Tower C', numericValue: 3 },
      { name: 'Tower D', numericValue: 4 },
      { name: 'Tower E', numericValue: 5 },
      { name: 'North Tower', numericValue: 6 },
      { name: 'South Tower', numericValue: 7 },
      { name: 'East Tower', numericValue: 8 },
      { name: 'West Tower', numericValue: 9 },
      { name: 'Central Tower', numericValue: 10 },
    ];

    const towers: TowerDocument[] = [];

    for (const towerData of towersData) {
      const tower = new this.towerModel({
        name: towerData.name,
        masterType: MasterType.TOWER,
        status: MasterStatus.ACTIVE,
        numericValue: towerData.numericValue,
        sortOrder: towers.length + 1,
        isPopular: Math.random() > 0.3,
        metadata: {
          type: faker.helpers.arrayElement(['residential', 'commercial', 'mixed']),
          floors: faker.number.int({ min: 10, max: 40 }),
          unitsPerFloor: faker.number.int({ min: 2, max: 8 }),
        }
      });

      towers.push(await tower.save());
    }

    console.log(`✅ Seeded ${towers.length} towers`);
    return towers;
  }

  /**
   * Seed property types
   */
  private async seedPropertyTypes(): Promise<PropertyTypeDocument[]> {
    console.log('🏠 Seeding property types...');

    const propertyTypesData = [
      { name: 'Apartment', category: 'residential' },
      { name: 'Villa', category: 'residential' },
      { name: 'Penthouse', category: 'residential' },
      { name: 'Studio', category: 'residential' },
      { name: 'Duplex', category: 'residential' },
      { name: 'Triplex', category: 'residential' },
      { name: 'Office Space', category: 'commercial' },
      { name: 'Retail Shop', category: 'commercial' },
      { name: 'Warehouse', category: 'commercial' },
      { name: 'Showroom', category: 'commercial' },
      { name: 'Restaurant Space', category: 'commercial' },
      { name: 'Co-working Space', category: 'commercial' },
    ];

    const propertyTypes: PropertyTypeDocument[] = [];

    for (const typeData of propertyTypesData) {
      const propertyType = new this.propertyTypeModel({
        name: typeData.name,
        masterType: MasterType.PROPERTY_TYPE,
        status: MasterStatus.ACTIVE,
        category: typeData.category,
        sortOrder: propertyTypes.length + 1,
        isPopular: ['Apartment', 'Villa', 'Office Space'].includes(typeData.name),
        metadata: {
          category: typeData.category,
          targetAudience: typeData.category === 'residential' ? 'families' : 'businesses',
        }
      });

      propertyTypes.push(await propertyType.save());
    }

    console.log(`✅ Seeded ${propertyTypes.length} property types`);
    return propertyTypes;
  }

  /**
   * Seed rooms
   */
  private async seedRooms(): Promise<RoomDocument[]> {
    console.log('🛏️ Seeding rooms...');

    const roomsData = [
      { name: 'Studio', numericValue: 0 },
      { name: '1 BHK', numericValue: 1 },
      { name: '2 BHK', numericValue: 2 },
      { name: '3 BHK', numericValue: 3 },
      { name: '4 BHK', numericValue: 4 },
      { name: '5 BHK', numericValue: 5 },
      { name: '6+ BHK', numericValue: 6 },
    ];

    const rooms: RoomDocument[] = [];

    for (const roomData of roomsData) {
      const room = new this.roomModel({
        name: roomData.name,
        masterType: MasterType.ROOM,
        status: MasterStatus.ACTIVE,
        numericValue: roomData.numericValue,
        sortOrder: rooms.length + 1,
        isPopular: roomData.numericValue >= 1 && roomData.numericValue <= 3,
        metadata: {
          type: roomData.numericValue === 0 ? 'studio' : 'bhk',
          targetFamily: this.getTargetFamily(roomData.numericValue),
        }
      });

      rooms.push(await room.save());
    }

    console.log(`✅ Seeded ${rooms.length} rooms`);
    return rooms;
  }

  /**
   * Seed washrooms
   */
  private async seedWashrooms(): Promise<WashroomDocument[]> {
    console.log('🚿 Seeding washrooms...');

    const washroomsData = [
      { name: '1 Bathroom', numericValue: 1 },
      { name: '2 Bathrooms', numericValue: 2 },
      { name: '3 Bathrooms', numericValue: 3 },
      { name: '4 Bathrooms', numericValue: 4 },
      { name: '5+ Bathrooms', numericValue: 5 },
    ];

    const washrooms: WashroomDocument[] = [];

    for (const washroomData of washroomsData) {
      const washroom = new this.washroomModel({
        name: washroomData.name,
        masterType: MasterType.WASHROOM,
        status: MasterStatus.ACTIVE,
        numericValue: washroomData.numericValue,
        sortOrder: washrooms.length + 1,
        isPopular: washroomData.numericValue >= 1 && washroomData.numericValue <= 3,
        metadata: {
          type: washroomData.numericValue === 1 ? 'single' : 'multiple',
        }
      });

      washrooms.push(await washroom.save());
    }

    console.log(`✅ Seeded ${washrooms.length} washrooms`);
    return washrooms;
  }

  private getTargetFamily(bedrooms: number): string {
    if (bedrooms === 0) return 'single/couple';
    if (bedrooms === 1) return 'couple/small family';
    if (bedrooms === 2) return 'small family';
    if (bedrooms === 3) return 'medium family';
    return 'large family';
  }

  /**
   * Seed builders
   */
  private async seedBuilders(): Promise<BuilderDocument[]> {
    console.log('🏗️ Seeding builders...');

    const buildersData = [
      'Lodha Group', 'Godrej Properties', 'DLF Limited', 'Oberoi Realty', 'Prestige Group',
      'Brigade Group', 'Sobha Limited', 'Puravankara Limited', 'Mahindra Lifespace',
      'Tata Housing', 'Hiranandani Group', 'Shapoorji Pallonji', 'L&T Realty',
      'Embassy Group', 'Phoenix Mills', 'Kolte-Patil', 'Rohan Builders',
      'Kalpataru Limited', 'Piramal Realty', 'Runwal Group', 'Rustomjee Group',
      'Shriram Properties', 'Nitesh Estates', 'Salarpuria Sattva', 'Mantri Developers'
    ];

    const builders: BuilderDocument[] = [];

    for (const builderName of buildersData) {
      const builder = new this.builderModel({
        name: builderName,
        description: `${builderName} is a leading real estate developer known for quality construction and timely delivery of projects across India.`,
        website: `https://www.${builderName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        contactEmail: `info@${builderName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        contactPhone: `+91-${faker.string.numeric(10)}`,
        logo: `https://example.com/logos/${builderName.toLowerCase().replace(/\s+/g, '-')}.png`,
      });

      builders.push(await builder.save());
    }

    console.log(`✅ Seeded ${builders.length} builders`);
    return builders;
  }

  /**
   * Seed agents
   */
  private async seedAgents(): Promise<AgentDocument[]> {
    console.log('👥 Seeding agents...');

    const agents: AgentDocument[] = [];
    const agentCount = 50;

    for (let i = 0; i < agentCount; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const agent = new this.agentModel({
        name: `${firstName} ${lastName}`,
        description: `Experienced real estate agent specializing in ${faker.helpers.arrayElement(['residential', 'commercial', 'luxury'])} properties with ${faker.number.int({ min: 2, max: 15 })} years of experience.`,
        email: faker.internet.email({ firstName, lastName }),
        phone: `+91-${faker.string.numeric(10)}`,
        address: faker.location.streetAddress({ useFullAddress: true }),
        licenseNumber: `REA${faker.string.alphanumeric(8).toUpperCase()}`,
        profileImage: faker.image.avatar(),
        isActive: Math.random() > 0.1,
      });

      agents.push(await agent.save());
    }

    console.log(`✅ Seeded ${agents.length} agents`);
    return agents;
  }

  /**
   * Seed projects
   */
  private async seedProjects(
    cities: CityDocument[],
    locations: LocationDocument[],
    amenities: AmenityDocument[],
    builders: BuilderDocument[]
  ): Promise<ProjectDocument[]> {
    console.log('🏢 Seeding projects...');

    const projects: ProjectDocument[] = [];
    const projectCount = 100;

    for (let i = 0; i < projectCount; i++) {
      const city = faker.helpers.arrayElement(cities);
      const cityLocations = locations.filter(loc => loc.parentId?.toString() === city._id.toString());
      const location = faker.helpers.arrayElement(cityLocations);
      const builder = faker.helpers.arrayElement(builders);
      const selectedAmenities = faker.helpers.arrayElements(amenities, { min: 5, max: 15 });

      const projectName = this.generateProjectName();
      const propertyType = faker.helpers.arrayElement(Object.values(PropertyTypeEnum));
      const unitConfigs = this.generateUnitConfigurations(propertyType);

      const project = new this.projectModel({
        projectName,
        projectDescription: `${projectName} is a premium ${propertyType.toLowerCase()} project by ${builder.name} located in the heart of ${location.name}, ${city.name}. This project offers world-class amenities and modern living spaces designed for contemporary lifestyle.`,

        builder: {
          name: builder.name,
          description: builder.description,
          website: builder.website,
          contactEmail: builder.contactEmail,
          contactPhone: builder.contactPhone,
          logo: builder.logo,
        },

        projectStatus: faker.helpers.arrayElement(Object.values(ProjectStatus)),

        location: {
          address: faker.location.streetAddress(),
          cityId: city._id,
          locationId: location._id,
          state: city.state,
          country: city.country,
          pincode: faker.location.zipCode('######'),
          landmark: `Near ${faker.helpers.arrayElement(['Metro Station', 'Shopping Mall', 'Hospital', 'School', 'IT Park'])}`,
          coordinates: location.coordinates,
        },

        reraNumber: `RERA${faker.string.alphanumeric(10).toUpperCase()}`,
        propertyType,
        unitConfigurations: unitConfigs,
        possessionStatus: faker.helpers.arrayElement(Object.values(PossessionStatus)),
        possessionDate: faker.date.future({ years: 3 }),

        totalArea: faker.number.int({ min: 1, max: 50 }),
        totalUnits: faker.number.int({ min: 50, max: 500 }),
        totalFloors: faker.number.int({ min: 5, max: 40 }),
        totalTowers: faker.number.int({ min: 1, max: 8 }),

        priceMin: Math.min(...unitConfigs.map(u => u.priceMin)),
        priceMax: Math.max(...unitConfigs.map(u => u.priceMax)),
        pricePerSqFt: faker.number.int({ min: 3000, max: 15000 }),

        amenities: {
          amenityIds: selectedAmenities.map(a => a._id),
        },

        media: {
          images: this.generateMediaUrls('images', faker.number.int({ min: 5, max: 20 })),
          videos: this.generateMediaUrls('videos', faker.number.int({ min: 1, max: 5 })),
          brochures: this.generateMediaUrls('brochures', faker.number.int({ min: 1, max: 3 })),
          floorPlans: this.generateMediaUrls('floor-plans', faker.number.int({ min: 2, max: 8 })),
          masterPlan: this.generateMediaUrls('master-plan', 1),
          locationMap: this.generateMediaUrls('location-map', 1),
        },

        documents: {
          approvals: this.generateMediaUrls('approvals', faker.number.int({ min: 1, max: 5 })),
          legalDocuments: this.generateMediaUrls('legal', faker.number.int({ min: 1, max: 3 })),
          certificates: this.generateMediaUrls('certificates', faker.number.int({ min: 1, max: 4 })),
          others: this.generateMediaUrls('others', faker.number.int({ min: 0, max: 2 })),
        },

        tags: this.generateProjectTags(propertyType, city.name),
        highlights: `Premium ${propertyType.toLowerCase()} with ${selectedAmenities.length}+ amenities in ${city.name}`,
        approvalStatus: faker.helpers.arrayElement(Object.values(ApprovalStatus)),
        nearbyFacilities: this.generateNearbyFacilities(),

        isActive: Math.random() > 0.05,
        isFeatured: Math.random() > 0.7,
        viewCount: faker.number.int({ min: 0, max: 10000 }),
        inquiryCount: faker.number.int({ min: 0, max: 500 }),
      });

      projects.push(await project.save());
    }

    console.log(`✅ Seeded ${projects.length} projects`);
    return projects;
  }

  // Helper methods for project generation
  private generateProjectName(): string {
    const prefixes = ['Royal', 'Grand', 'Elite', 'Premium', 'Luxury', 'Golden', 'Silver', 'Diamond', 'Platinum', 'Crown'];
    const middle = ['Heights', 'Residency', 'Gardens', 'Plaza', 'Towers', 'Enclave', 'Paradise', 'Vista', 'Palms', 'Springs'];
    const suffixes = ['Phase 1', 'Phase 2', 'Phase 3', 'Block A', 'Block B', 'Extension', 'Annexe', ''];

    const prefix = faker.helpers.arrayElement(prefixes);
    const mid = faker.helpers.arrayElement(middle);
    const suffix = faker.helpers.arrayElement(suffixes);

    return `${prefix} ${mid}${suffix ? ' ' + suffix : ''}`.trim();
  }

  private generateUnitConfigurations(propertyType: PropertyTypeEnum): any[] {
    const configs = [];

    // Use appropriate unit types based on property type
    let unitTypes: UnitType[];
    if (propertyType === PropertyTypeEnum.COMMERCIAL) {
      unitTypes = [UnitType.OFFICE, UnitType.SHOP, UnitType.WAREHOUSE];
    } else {
      unitTypes = [UnitType.STUDIO, UnitType.APARTMENT, UnitType.VILLA, UnitType.PENTHOUSE];
    }

    const numConfigs = faker.number.int({ min: 1, max: 3 });
    const selectedTypes = faker.helpers.arrayElements(unitTypes, { min: numConfigs, max: numConfigs });

    for (const unitType of selectedTypes) {
      const bedrooms = this.getBedroomsFromUnitType(unitType);
      const bathrooms = Math.min(bedrooms + 1, bedrooms === 0 ? 1 : bedrooms);
      const carpetArea = this.getCarpetAreaRange(bedrooms, unitType);
      const priceRange = this.getPriceRange(carpetArea, propertyType);

      configs.push({
        type: unitType,
        name: this.getUnitDisplayName(unitType, bedrooms),
        bedrooms,
        bathrooms,
        balconies: bedrooms > 0 ? faker.number.int({ min: 1, max: Math.max(1, bedrooms - 1) }) : 0,
        carpetArea,
        builtUpArea: Math.round(carpetArea * 1.2),
        superBuiltUpArea: Math.round(carpetArea * 1.4),
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        totalUnits: faker.number.int({ min: 10, max: 100 }),
        availableUnits: faker.number.int({ min: 5, max: 50 }),
        facing: faker.helpers.arrayElements(['NORTH', 'SOUTH', 'EAST', 'WEST'], { min: 1, max: 2 }),
        floorPlans: this.generateMediaUrls('floor-plans', faker.number.int({ min: 1, max: 3 })),
      });
    }

    return configs;
  }

  private getBedroomsFromUnitType(unitType: UnitType): number {
    const mapping = {
      [UnitType.STUDIO]: 0,
      [UnitType.APARTMENT]: faker.number.int({ min: 1, max: 4 }),
      [UnitType.VILLA]: faker.number.int({ min: 3, max: 6 }),
      [UnitType.PENTHOUSE]: faker.number.int({ min: 3, max: 5 }),
      [UnitType.OFFICE]: 0,
      [UnitType.SHOP]: 0,
      [UnitType.WAREHOUSE]: 0,
      [UnitType.PLOT]: 0,
    };
    return mapping[unitType] || 2;
  }

  private getUnitDisplayName(unitType: UnitType, bedrooms: number): string {
    if (unitType === UnitType.STUDIO) return 'Studio';
    if (unitType === UnitType.OFFICE) return 'Office Space';
    if (unitType === UnitType.SHOP) return 'Retail Shop';
    if (unitType === UnitType.WAREHOUSE) return 'Warehouse';
    if (unitType === UnitType.PLOT) return 'Plot';
    if (unitType === UnitType.PENTHOUSE) return `${bedrooms} BHK Penthouse`;
    if (unitType === UnitType.VILLA) return `${bedrooms} BHK Villa`;

    return `${bedrooms} BHK Apartment`;
  }

  private getCarpetAreaRange(bedrooms: number, unitType: UnitType): number {
    // Commercial spaces
    if (unitType === UnitType.OFFICE) {
      return faker.number.int({ min: 200, max: 2000 });
    }
    if (unitType === UnitType.SHOP) {
      return faker.number.int({ min: 100, max: 800 });
    }
    if (unitType === UnitType.WAREHOUSE) {
      return faker.number.int({ min: 1000, max: 10000 });
    }
    if (unitType === UnitType.PLOT) {
      return faker.number.int({ min: 1000, max: 5000 });
    }

    // Residential spaces
    const ranges = {
      0: { min: 300, max: 500 },   // Studio
      1: { min: 500, max: 700 },   // 1 BHK
      2: { min: 700, max: 1200 },  // 2 BHK
      3: { min: 1200, max: 1800 }, // 3 BHK
      4: { min: 1800, max: 2500 }, // 4 BHK
      5: { min: 2500, max: 3500 }, // 5 BHK
      6: { min: 3500, max: 5000 }, // 6 BHK
    };

    // Villa and Penthouse multipliers
    let multiplier = 1;
    if (unitType === UnitType.VILLA) multiplier = 1.5;
    if (unitType === UnitType.PENTHOUSE) multiplier = 1.3;

    const range = ranges[bedrooms] || ranges[2];
    return Math.round(faker.number.int({ min: range.min, max: range.max }) * multiplier);
  }

  private getPriceRange(carpetArea: number, propertyType: PropertyTypeEnum): { min: number, max: number } {
    const basePrice = carpetArea * faker.number.int({ min: 4000, max: 12000 });
    const variation = basePrice * 0.2;

    const multiplier = propertyType === PropertyTypeEnum.RESIDENTIAL ? 1.2 :
                      propertyType === PropertyTypeEnum.COMMERCIAL ? 1.5 : 1;

    return {
      min: Math.round((basePrice - variation) * multiplier),
      max: Math.round((basePrice + variation) * multiplier),
    };
  }

  private generateMediaUrls(type: string, count: number): string[] {
    const urls = [];
    for (let i = 0; i < count; i++) {
      urls.push(`https://trelax-media.s3.amazonaws.com/${type}/${faker.string.uuid()}.${this.getFileExtension(type)}`);
    }
    return urls;
  }

  private getFileExtension(type: string): string {
    const extensions = {
      'images': 'jpg',
      'videos': 'mp4',
      'brochures': 'pdf',
      'floor-plans': 'jpg',
      'master-plan': 'jpg',
      'location-map': 'jpg',
      'approvals': 'pdf',
      'legal': 'pdf',
      'certificates': 'pdf',
      'others': 'pdf',
    };
    return extensions[type] || 'jpg';
  }

  private generateProjectTags(propertyType: PropertyTypeEnum, cityName: string): string[] {
    const baseTags = [propertyType.toLowerCase(), cityName.toLowerCase()];
    const additionalTags = [
      'luxury', 'premium', 'modern', 'spacious', 'well-connected', 'gated-community',
      'ready-to-move', 'under-construction', 'investment', 'family-friendly'
    ];

    return [...baseTags, ...faker.helpers.arrayElements(additionalTags, { min: 3, max: 6 })];
  }

  private generateNearbyFacilities(): string[] {
    const facilities = [
      'Metro Station - 500m', 'Shopping Mall - 1km', 'Hospital - 800m', 'School - 300m',
      'IT Park - 2km', 'Airport - 15km', 'Railway Station - 3km', 'Bus Stop - 200m',
      'Bank - 400m', 'Restaurant - 100m', 'Pharmacy - 250m', 'Gym - 150m',
      'Park - 300m', 'Temple - 600m', 'Market - 500m', 'ATM - 100m'
    ];

    return faker.helpers.arrayElements(facilities, { min: 5, max: 10 });
  }
}
