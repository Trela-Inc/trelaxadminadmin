import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  IsObject,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { MasterWithLocationDto } from '../../common/dto/base-master.dto';
import { MasterType } from '../../common/enums/master-types.enum';

/**
 * Economic Data DTO
 */
export class EconomicDataDto {
  @ApiPropertyOptional({ 
    description: 'GDP in billions',
    example: 310.5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gdp?: number;

  @ApiPropertyOptional({ 
    description: 'Major industries in the city',
    example: ['IT', 'Finance', 'Manufacturing']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  majorIndustries?: string[];

  @ApiPropertyOptional({ 
    description: 'Economic growth rate percentage',
    example: 7.2
  })
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  economicGrowthRate?: number;
}

/**
 * Climate Data DTO
 */
export class ClimateDataDto {
  @ApiPropertyOptional({ 
    description: 'Average temperature in Celsius',
    example: 28.5
  })
  @IsOptional()
  @IsNumber()
  @Min(-50)
  @Max(60)
  averageTemperature?: number;

  @ApiPropertyOptional({ 
    description: 'Annual rainfall in mm',
    example: 2400
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rainfall?: number;

  @ApiPropertyOptional({ 
    description: 'Average humidity percentage',
    example: 75
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity?: number;

  @ApiPropertyOptional({ 
    description: 'Predominant season',
    example: 'Tropical'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  season?: string;
}

/**
 * Real Estate Data DTO
 */
export class RealEstateDataDto {
  @ApiPropertyOptional({ 
    description: 'Average property price per sq ft',
    example: 8500
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averagePropertyPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Price appreciation rate percentage',
    example: 12.5
  })
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  priceAppreciationRate?: number;

  @ApiPropertyOptional({ 
    description: 'Rental yield percentage',
    example: 3.2
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rentalYield?: number;

  @ApiPropertyOptional({ 
    description: 'Popular areas for real estate',
    example: ['Bandra', 'Andheri', 'Powai']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  popularAreas?: string[];

  @ApiPropertyOptional({ 
    description: 'Number of upcoming projects',
    example: 45
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  upcomingProjects?: number;
}

/**
 * Create City DTO
 * Extends MasterWithLocationDto with city-specific fields
 */
export class CreateCityDto extends MasterWithLocationDto {
  @ApiProperty({ 
    description: 'City name',
    example: 'Mumbai',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'City description',
    example: 'Financial capital of India',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Unique city code',
    example: 'MUM',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ 
    description: 'State name',
    example: 'Maharashtra',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiPropertyOptional({ 
    description: 'Country name',
    example: 'India',
    maxLength: 100,
    default: 'India'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string = 'India';

  @ApiPropertyOptional({ 
    description: 'State code',
    example: 'MH',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  stateCode?: string;

  @ApiPropertyOptional({ 
    description: 'Country code',
    example: 'IN',
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  @ApiPropertyOptional({ 
    description: 'Population count',
    example: 12442373
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  population?: number;

  @ApiPropertyOptional({ 
    description: 'Area in square kilometers',
    example: 603.4
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiPropertyOptional({ 
    description: 'Major language spoken',
    example: 'Marathi',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  majorLanguage?: string;

  @ApiPropertyOptional({ 
    description: 'Alternative names for the city',
    example: ['Bombay', 'Mumbai City']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alternateNames?: string[];

  @ApiPropertyOptional({ 
    description: 'Economic data',
    type: EconomicDataDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EconomicDataDto)
  economicData?: EconomicDataDto;

  @ApiPropertyOptional({ 
    description: 'Climate data',
    type: ClimateDataDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClimateDataDto)
  climateData?: ClimateDataDto;

  @ApiPropertyOptional({ 
    description: 'Nearby airport codes',
    example: ['BOM', 'VABB']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nearbyAirports?: string[];

  @ApiPropertyOptional({ 
    description: 'Major railway stations',
    example: ['Mumbai Central', 'Chhatrapati Shivaji Terminus']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  majorRailwayStations?: string[];

  @ApiPropertyOptional({ 
    description: 'Major highways',
    example: ['NH-8', 'NH-4', 'Eastern Express Highway']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highways?: string[];

  @ApiPropertyOptional({ 
    description: 'Real estate data',
    type: RealEstateDataDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RealEstateDataDto)
  realEstateData?: RealEstateDataDto;

  @ApiPropertyOptional({ 
    description: 'District name',
    example: 'Mumbai Suburban',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({ 
    description: 'Division name',
    example: 'Konkan Division',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  division?: string;

  @ApiPropertyOptional({ 
    description: 'Neighboring cities',
    example: ['Pune', 'Nashik', 'Thane']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  neighboringCities?: string[];

  @ApiPropertyOptional({ 
    description: 'SEO title',
    example: 'Mumbai - Financial Capital of India | Real Estate',
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ 
    description: 'SEO description',
    example: 'Discover premium real estate opportunities in Mumbai, the financial capital of India.',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ 
    description: 'SEO keywords',
    example: ['mumbai real estate', 'mumbai properties', 'mumbai apartments']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @ApiPropertyOptional({ 
    description: 'Featured image URL',
    example: 'https://s3.amazonaws.com/bucket/mumbai-skyline.jpg'
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ 
    description: 'Gallery image URLs',
    example: ['https://s3.amazonaws.com/bucket/mumbai-1.jpg', 'https://s3.amazonaws.com/bucket/mumbai-2.jpg']
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  gallery?: string[];

  // Set masterType to CITY (inherited from base)
  masterType: MasterType.CITY = MasterType.CITY;
}
