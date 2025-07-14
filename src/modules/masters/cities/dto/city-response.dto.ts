import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterStatus, MasterType } from '../../common/enums/master-types.enum';

/**
 * Economic Data Response DTO
 */
export class EconomicDataResponseDto {
  @ApiPropertyOptional({ 
    description: 'GDP in billions',
    example: 310.5
  })
  gdp?: number;

  @ApiPropertyOptional({ 
    description: 'Major industries in the city',
    example: ['IT', 'Finance', 'Manufacturing']
  })
  majorIndustries?: string[];

  @ApiPropertyOptional({ 
    description: 'Economic growth rate percentage',
    example: 7.2
  })
  economicGrowthRate?: number;
}

/**
 * Climate Data Response DTO
 */
export class ClimateDataResponseDto {
  @ApiPropertyOptional({ 
    description: 'Average temperature in Celsius',
    example: 28.5
  })
  averageTemperature?: number;

  @ApiPropertyOptional({ 
    description: 'Annual rainfall in mm',
    example: 2400
  })
  rainfall?: number;

  @ApiPropertyOptional({ 
    description: 'Average humidity percentage',
    example: 75
  })
  humidity?: number;

  @ApiPropertyOptional({ 
    description: 'Predominant season',
    example: 'Tropical'
  })
  season?: string;
}

/**
 * Real Estate Data Response DTO
 */
export class RealEstateDataResponseDto {
  @ApiPropertyOptional({ 
    description: 'Average property price per sq ft',
    example: 8500
  })
  averagePropertyPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Price appreciation rate percentage',
    example: 12.5
  })
  priceAppreciationRate?: number;

  @ApiPropertyOptional({ 
    description: 'Rental yield percentage',
    example: 3.2
  })
  rentalYield?: number;

  @ApiPropertyOptional({ 
    description: 'Popular areas for real estate',
    example: ['Bandra', 'Andheri', 'Powai']
  })
  popularAreas?: string[];

  @ApiPropertyOptional({ 
    description: 'Number of upcoming projects',
    example: 45
  })
  upcomingProjects?: number;
}

/**
 * City Response DTO
 * Response structure for city data
 */
export class CityResponseDto {
  @ApiProperty({ 
    description: 'City ID',
    example: '507f1f77bcf86cd799439011'
  })
  _id: string;

  @ApiProperty({ 
    description: 'City name',
    example: 'Mumbai'
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'City description',
    example: 'Financial capital of India'
  })
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Unique city code',
    example: 'MUM'
  })
  code?: string;

  @ApiProperty({ 
    description: 'Master type',
    enum: MasterType,
    example: MasterType.CITY
  })
  masterType: MasterType.CITY;

  @ApiProperty({ 
    description: 'Status',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  status: MasterStatus;

  @ApiProperty({ 
    description: 'State name',
    example: 'Maharashtra'
  })
  state: string;

  @ApiProperty({ 
    description: 'Country name',
    example: 'India'
  })
  country: string;

  @ApiPropertyOptional({ 
    description: 'State code',
    example: 'MH'
  })
  stateCode?: string;

  @ApiPropertyOptional({ 
    description: 'Country code',
    example: 'IN'
  })
  countryCode?: string;

  @ApiPropertyOptional({ 
    description: 'Coordinates [longitude, latitude]',
    example: [72.8777, 19.0760]
  })
  coordinates?: [number, number];

  @ApiPropertyOptional({ 
    description: 'Timezone',
    example: 'Asia/Kolkata'
  })
  timezone?: string;

  @ApiPropertyOptional({ 
    description: 'Pin codes',
    example: ['400001', '400002', '400003']
  })
  pinCodes?: string[];

  @ApiPropertyOptional({ 
    description: 'Population count',
    example: 12442373
  })
  population?: number;

  @ApiPropertyOptional({ 
    description: 'Area in square kilometers',
    example: 603.4
  })
  area?: number;

  @ApiPropertyOptional({ 
    description: 'Major language spoken',
    example: 'Marathi'
  })
  majorLanguage?: string;

  @ApiPropertyOptional({ 
    description: 'Alternative names',
    example: ['Bombay', 'Mumbai City']
  })
  alternateNames?: string[];

  @ApiPropertyOptional({ 
    description: 'Economic data',
    type: EconomicDataResponseDto
  })
  economicData?: EconomicDataResponseDto;

  @ApiPropertyOptional({ 
    description: 'Climate data',
    type: ClimateDataResponseDto
  })
  climateData?: ClimateDataResponseDto;

  @ApiPropertyOptional({ 
    description: 'Nearby airports',
    example: ['BOM', 'VABB']
  })
  nearbyAirports?: string[];

  @ApiPropertyOptional({ 
    description: 'Major railway stations',
    example: ['Mumbai Central', 'Chhatrapati Shivaji Terminus']
  })
  majorRailwayStations?: string[];

  @ApiPropertyOptional({ 
    description: 'Major highways',
    example: ['NH-8', 'NH-4', 'Eastern Express Highway']
  })
  highways?: string[];

  @ApiPropertyOptional({ 
    description: 'Real estate data',
    type: RealEstateDataResponseDto
  })
  realEstateData?: RealEstateDataResponseDto;

  @ApiPropertyOptional({ 
    description: 'District name',
    example: 'Mumbai Suburban'
  })
  district?: string;

  @ApiPropertyOptional({ 
    description: 'Division name',
    example: 'Konkan Division'
  })
  division?: string;

  @ApiPropertyOptional({ 
    description: 'Neighboring cities',
    example: ['Pune', 'Nashik', 'Thane']
  })
  neighboringCities?: string[];

  @ApiPropertyOptional({ 
    description: 'Sort order',
    example: 1
  })
  sortOrder?: number;

  @ApiPropertyOptional({ 
    description: 'Is default city',
    example: false
  })
  isDefault?: boolean;

  @ApiPropertyOptional({ 
    description: 'Is popular city',
    example: true
  })
  isPopular?: boolean;

  @ApiPropertyOptional({ 
    description: 'SEO title',
    example: 'Mumbai - Financial Capital of India | Real Estate'
  })
  seoTitle?: string;

  @ApiPropertyOptional({ 
    description: 'SEO description',
    example: 'Discover premium real estate opportunities in Mumbai, the financial capital of India.'
  })
  seoDescription?: string;

  @ApiPropertyOptional({ 
    description: 'SEO keywords',
    example: ['mumbai real estate', 'mumbai properties', 'mumbai apartments']
  })
  seoKeywords?: string[];

  @ApiPropertyOptional({ 
    description: 'Featured image URL',
    example: 'https://s3.amazonaws.com/bucket/mumbai-skyline.jpg'
  })
  featuredImage?: string;

  @ApiPropertyOptional({ 
    description: 'Gallery images',
    example: ['https://s3.amazonaws.com/bucket/mumbai-1.jpg', 'https://s3.amazonaws.com/bucket/mumbai-2.jpg']
  })
  gallery?: string[];

  @ApiPropertyOptional({ 
    description: 'Additional metadata',
    example: { color: '#FF5733', icon: 'city-icon' }
  })
  metadata?: Record<string, any>;

  @ApiProperty({ 
    description: 'Creation date',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update date',
    example: '2024-01-15T10:30:00.000Z'
  })
  updatedAt: Date;

  @ApiPropertyOptional({ 
    description: 'Full location name (virtual field)',
    example: 'Mumbai, Maharashtra, India'
  })
  fullName?: string;

  @ApiPropertyOptional({ 
    description: 'GeoJSON location (virtual field)',
    example: { type: 'Point', coordinates: [72.8777, 19.0760] }
  })
  geoLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * City List Response DTO
 */
export class CityListResponseDto {
  @ApiProperty({ 
    description: 'Success status',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'List of cities',
    type: [CityResponseDto]
  })
  data: CityResponseDto[];

  @ApiProperty({ 
    description: 'Pagination information'
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  @ApiPropertyOptional({ 
    description: 'Response message',
    example: 'Cities retrieved successfully'
  })
  message?: string;
}

/**
 * Single City Response DTO
 */
export class SingleCityResponseDto {
  @ApiProperty({ 
    description: 'Success status',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'City data',
    type: CityResponseDto
  })
  data: CityResponseDto;

  @ApiPropertyOptional({ 
    description: 'Response message',
    example: 'City retrieved successfully'
  })
  message?: string;
}
