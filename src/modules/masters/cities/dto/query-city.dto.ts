import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryMasterWithLocationDto } from '../../common/dto/query-master.dto';

/**
 * Query City DTO
 * Extends QueryMasterWithLocationDto with city-specific filters
 */
export class QueryCityDto extends QueryMasterWithLocationDto {
  @ApiPropertyOptional({ 
    description: 'Filter by state code',
    example: 'MH'
  })
  @IsOptional()
  @IsString()
  stateCode?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by country code',
    example: 'IN'
  })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({ 
    description: 'Minimum population',
    example: 1000000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPopulation?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum population',
    example: 20000000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPopulation?: number;

  @ApiPropertyOptional({ 
    description: 'Minimum area in sq km',
    example: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minArea?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum area in sq km',
    example: 1000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxArea?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by major language',
    example: 'Hindi'
  })
  @IsOptional()
  @IsString()
  majorLanguage?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by district',
    example: 'Mumbai Suburban'
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by division',
    example: 'Konkan Division'
  })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiPropertyOptional({ 
    description: 'Minimum average property price',
    example: 5000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPropertyPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum average property price',
    example: 15000
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
    example: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  maxAppreciationRate?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by nearby airport code',
    example: 'BOM'
  })
  @IsOptional()
  @IsString()
  nearbyAirport?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by highway',
    example: 'NH-8'
  })
  @IsOptional()
  @IsString()
  highway?: string;

  @ApiPropertyOptional({ 
    description: 'Filter cities with featured images only',
    example: true
  })
  @IsOptional()
  hasFeaturedImage?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter cities with gallery images only',
    example: true
  })
  @IsOptional()
  hasGallery?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter cities with real estate data only',
    example: true
  })
  @IsOptional()
  hasRealEstateData?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter cities with economic data only',
    example: true
  })
  @IsOptional()
  hasEconomicData?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter cities with climate data only',
    example: true
  })
  @IsOptional()
  hasClimateData?: boolean;
}
