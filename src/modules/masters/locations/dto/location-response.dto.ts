import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterStatus, MasterType } from '../../common/enums/master-types.enum';

/**
 * Location Response DTO
 * Response structure for location data
 */
export class LocationResponseDto {
  @ApiProperty({ 
    description: 'Location ID',
    example: '507f1f77bcf86cd799439012'
  })
  _id: string;

  @ApiProperty({ 
    description: 'Location name',
    example: 'Bandra West'
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Location description',
    example: 'Premium residential and commercial area in Mumbai'
  })
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Unique location code',
    example: 'BW'
  })
  code?: string;

  @ApiProperty({ 
    description: 'Master type',
    enum: MasterType,
    example: MasterType.LOCATION
  })
  masterType: MasterType.LOCATION;

  @ApiProperty({ 
    description: 'Status',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  status: MasterStatus;

  @ApiProperty({ 
    description: 'Parent city ID',
    example: '507f1f77bcf86cd799439011'
  })
  parentId: string;

  @ApiProperty({ 
    description: 'Parent type',
    enum: MasterType,
    example: MasterType.CITY
  })
  parentType: MasterType.CITY;

  @ApiPropertyOptional({ 
    description: 'Location code within city',
    example: 'BW001'
  })
  locationCode?: string;

  @ApiPropertyOptional({ 
    description: 'Coordinates [longitude, latitude]',
    example: [72.8265, 19.0596]
  })
  coordinates?: [number, number];

  @ApiPropertyOptional({ 
    description: 'Full address',
    example: 'Bandra West, Mumbai, Maharashtra 400050'
  })
  address?: string;

  @ApiPropertyOptional({ 
    description: 'Pincode',
    example: '400050'
  })
  pincode?: string;

  @ApiPropertyOptional({ 
    description: 'Nearby landmark',
    example: 'Near Bandra Bandstand'
  })
  landmark?: string;

  @ApiPropertyOptional({ 
    description: 'Alternative names',
    example: ['Bandra (W)', 'West Bandra']
  })
  alternateNames?: string[];

  @ApiPropertyOptional({ 
    description: 'Location type',
    example: 'residential'
  })
  locationType?: string;

  @ApiPropertyOptional({ 
    description: 'Location category',
    example: 'premium'
  })
  locationCategory?: string;

  @ApiPropertyOptional({ 
    description: 'Connectivity information'
  })
  connectivity?: {
    nearestMetroStation?: string;
    metroDistance?: number;
    nearestRailwayStation?: string;
    railwayDistance?: number;
    nearestAirport?: string;
    airportDistance?: number;
    majorRoads?: string[];
    busConnectivity?: string[];
  };

  @ApiPropertyOptional({ 
    description: 'Real estate data'
  })
  realEstateData?: {
    averagePropertyPrice?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    priceAppreciationRate?: number;
    rentalYield?: number;
    popularPropertyTypes?: string[];
    upcomingProjects?: number;
    totalProjects?: number;
    occupancyRate?: number;
  };

  @ApiPropertyOptional({ 
    description: 'Nearby facilities'
  })
  nearbyFacilities?: {
    schools?: string[];
    hospitals?: string[];
    shoppingMalls?: string[];
    restaurants?: string[];
    banks?: string[];
    parks?: string[];
    gyms?: string[];
    temples?: string[];
  };

  @ApiPropertyOptional({ 
    description: 'Sort order',
    example: 1
  })
  sortOrder?: number;

  @ApiPropertyOptional({ 
    description: 'Is default location',
    example: false
  })
  isDefault?: boolean;

  @ApiPropertyOptional({ 
    description: 'Is popular location',
    example: true
  })
  isPopular?: boolean;

  @ApiPropertyOptional({ 
    description: 'SEO title',
    example: 'Bandra West Mumbai - Premium Real Estate Location'
  })
  seoTitle?: string;

  @ApiPropertyOptional({ 
    description: 'SEO description',
    example: 'Discover premium properties in Bandra West, Mumbai\'s most sought-after residential area.'
  })
  seoDescription?: string;

  @ApiPropertyOptional({ 
    description: 'SEO keywords',
    example: ['bandra west properties', 'mumbai real estate', 'premium apartments bandra']
  })
  seoKeywords?: string[];

  @ApiPropertyOptional({ 
    description: 'Featured image URL',
    example: 'https://s3.amazonaws.com/bucket/bandra-west.jpg'
  })
  featuredImage?: string;

  @ApiPropertyOptional({ 
    description: 'Gallery images',
    example: ['https://s3.amazonaws.com/bucket/bandra-1.jpg', 'https://s3.amazonaws.com/bucket/bandra-2.jpg']
  })
  gallery?: string[];

  @ApiPropertyOptional({ 
    description: 'Additional metadata',
    example: { color: '#FF5733', icon: 'location-icon' }
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
    description: 'Full location name with city (virtual field)',
    example: 'Bandra West, Mumbai'
  })
  fullName?: string;

  @ApiPropertyOptional({ 
    description: 'GeoJSON location (virtual field)',
    example: { type: 'Point', coordinates: [72.8265, 19.0596] }
  })
  geoLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @ApiPropertyOptional({ 
    description: 'Parent city information (populated)',
    example: { _id: '507f1f77bcf86cd799439011', name: 'Mumbai', masterType: 'city' }
  })
  parentCity?: {
    _id: string;
    name: string;
    masterType: string;
  };
}

/**
 * Location List Response DTO
 */
export class LocationListResponseDto {
  @ApiProperty({ 
    description: 'Success status',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'List of locations',
    type: [LocationResponseDto]
  })
  data: LocationResponseDto[];

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
    example: 'Locations retrieved successfully'
  })
  message?: string;
}

/**
 * Single Location Response DTO
 */
export class SingleLocationResponseDto {
  @ApiProperty({ 
    description: 'Success status',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Location data',
    type: LocationResponseDto
  })
  data: LocationResponseDto;

  @ApiPropertyOptional({ 
    description: 'Response message',
    example: 'Location retrieved successfully'
  })
  message?: string;
}
