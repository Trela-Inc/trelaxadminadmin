import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  IsEnum,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { MasterWithCategoryDto } from '../../common/dto/base-master.dto';
import { MasterType, PropertyTypeCategory } from '../../common/enums/master-types.enum';

export class PropertySpecificationsDto {
  @ApiPropertyOptional({ description: 'Minimum area in sq ft', example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minArea?: number;

  @ApiPropertyOptional({ description: 'Maximum area in sq ft', example: 2000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxArea?: number;

  @ApiPropertyOptional({ description: 'Typical number of floors', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  typicalFloors?: number;

  @ApiPropertyOptional({ description: 'Number of parking spaces', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  parkingSpaces?: number;

  @ApiPropertyOptional({ description: 'Number of balconies', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balconies?: number;

  @ApiPropertyOptional({ description: 'Number of bathrooms', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ description: 'Number of bedrooms', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;
}

export class PriceRangeDto {
  @ApiPropertyOptional({ description: 'Minimum price', example: 5000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 15000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max?: number;

  @ApiPropertyOptional({ description: 'Currency', example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string = 'INR';
}

export class CreatePropertyTypeDto extends MasterWithCategoryDto {
  @ApiProperty({ description: 'Property type name', example: '2 BHK Apartment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Property type description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Property type code', example: '2BHK' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ 
    description: 'Property type category',
    enum: PropertyTypeCategory,
    example: PropertyTypeCategory.RESIDENTIAL
  })
  @IsEnum(PropertyTypeCategory)
  category: PropertyTypeCategory;

  @ApiPropertyOptional({ description: 'Icon identifier', example: 'apartment' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ description: 'Color code', example: '#4CAF50' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  color?: string;

  @ApiPropertyOptional({ 
    description: 'Suitable for',
    example: ['investment', 'residence', 'rental']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suitableFor?: string[];

  @ApiPropertyOptional({ type: PropertySpecificationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertySpecificationsDto)
  specifications?: PropertySpecificationsDto;

  @ApiPropertyOptional({ 
    description: 'Property features',
    example: ['balcony', 'parking', 'garden', 'security']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ type: PriceRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceRangeDto)
  priceRange?: PriceRangeDto;

  @ApiPropertyOptional({ 
    description: 'Popularity rating (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  popularityRating?: number;

  @ApiPropertyOptional({ 
    description: 'Target audience',
    example: ['families', 'young_professionals', 'investors']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetAudience?: string[];

  @ApiPropertyOptional({ 
    description: 'Legal requirements',
    example: ['RERA registration', 'Occupancy certificate']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  legalRequirements?: string[];

  @ApiPropertyOptional({ description: 'SEO title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'Featured image URL' })
  @IsOptional()
  @IsString()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Gallery image URLs' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  gallery?: string[];

  masterType: MasterType.PROPERTY_TYPE = MasterType.PROPERTY_TYPE;
}
