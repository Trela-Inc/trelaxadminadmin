import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsMongoId, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryMasterWithParentDto } from '../../common/dto/query-master.dto';

/**
 * Query Location DTO
 * Extends QueryMasterWithParentDto with location-specific filters
 */
export class QueryLocationDto extends QueryMasterWithParentDto {
  @ApiPropertyOptional({ 
    description: 'Filter by city ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  cityId?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by location type',
    example: 'residential',
    enum: ['residential', 'commercial', 'mixed', 'industrial', 'it_hub', 'business_district', 'suburb', 'downtown', 'waterfront', 'hillside']
  })
  @IsOptional()
  @IsEnum(['residential', 'commercial', 'mixed', 'industrial', 'it_hub', 'business_district', 'suburb', 'downtown', 'waterfront', 'hillside'])
  locationType?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by location category',
    example: 'premium',
    enum: ['prime', 'premium', 'mid_range', 'budget', 'luxury', 'affordable', 'upcoming', 'established']
  })
  @IsOptional()
  @IsEnum(['prime', 'premium', 'mid_range', 'budget', 'luxury', 'affordable', 'upcoming', 'established'])
  locationCategory?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by pincode',
    example: '400050'
  })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({ 
    description: 'Minimum average property price',
    example: 8000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPropertyPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum average property price',
    example: 20000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPropertyPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Minimum price appreciation rate',
    example: 5
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  minAppreciationRate?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum price appreciation rate',
    example: 15
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  maxAppreciationRate?: number;

  @ApiPropertyOptional({ 
    description: 'Minimum rental yield',
    example: 2
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minRentalYield?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum rental yield',
    example: 6
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxRentalYield?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by nearby metro station',
    example: 'Bandra Station'
  })
  @IsOptional()
  @IsString()
  nearbyMetroStation?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum distance to metro in km',
    example: 5
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxMetroDistance?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by nearby railway station',
    example: 'Bandra Railway Station'
  })
  @IsOptional()
  @IsString()
  nearbyRailwayStation?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum distance to railway in km',
    example: 3
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxRailwayDistance?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum distance to airport in km',
    example: 25
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAirportDistance?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by property type',
    example: 'apartment'
  })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiPropertyOptional({ 
    description: 'Filter locations with connectivity data only',
    example: true
  })
  @IsOptional()
  hasConnectivity?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter locations with real estate data only',
    example: true
  })
  @IsOptional()
  hasRealEstateData?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter locations with nearby facilities data only',
    example: true
  })
  @IsOptional()
  hasNearbyFacilities?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter locations with featured images only',
    example: true
  })
  @IsOptional()
  hasFeaturedImage?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter locations with gallery images only',
    example: true
  })
  @IsOptional()
  hasGallery?: boolean;
}
