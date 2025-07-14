import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  IsObject,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { MasterWithCategoryDto } from '../../common/dto/base-master.dto';
import { MasterType, AmenityCategory } from '../../common/enums/master-types.enum';

/**
 * Specifications DTO
 */
export class SpecificationsDto {
  @ApiPropertyOptional({ 
    description: 'Size specification',
    example: 'Olympic size (50m x 25m)'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  size?: string;

  @ApiPropertyOptional({ 
    description: 'Capacity in number of people',
    example: 50
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ 
    description: 'Operating hours',
    example: '6 AM - 10 PM'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  operatingHours?: string;

  @ApiPropertyOptional({ 
    description: 'Monthly maintenance fee',
    example: 500
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maintenanceFee?: number;

  @ApiPropertyOptional({ 
    description: 'Additional features',
    example: ['Air Conditioned', 'Modern Equipment', 'Trainer Available']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}

/**
 * Availability DTO
 */
export class AvailabilityDto {
  @ApiPropertyOptional({ 
    description: 'Available in residential projects',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  residential?: boolean;

  @ApiPropertyOptional({ 
    description: 'Available in commercial projects',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  commercial?: boolean;

  @ApiPropertyOptional({ 
    description: 'Premium/luxury amenity',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  luxury?: boolean;

  @ApiPropertyOptional({ 
    description: 'Basic amenity',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  basic?: boolean;
}

/**
 * Create Amenity DTO
 * Extends MasterWithCategoryDto with amenity-specific fields
 */
export class CreateAmenityDto extends MasterWithCategoryDto {
  @ApiProperty({ 
    description: 'Amenity name',
    example: 'Swimming Pool',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Amenity description',
    example: 'Olympic size swimming pool with modern filtration system',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Unique amenity code',
    example: 'POOL',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ 
    description: 'Amenity category',
    enum: AmenityCategory,
    example: AmenityCategory.RECREATIONAL
  })
  @IsEnum(AmenityCategory)
  category: AmenityCategory;

  @ApiPropertyOptional({ 
    description: 'Icon identifier',
    example: 'swimming-pool',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ 
    description: 'Color code for UI display',
    example: '#0066CC',
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  color?: string;

  @ApiPropertyOptional({ 
    description: 'Additional tags for filtering',
    example: ['water', 'sports', 'fitness', 'recreation']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ 
    description: 'Amenity specifications',
    type: SpecificationsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SpecificationsDto)
  specifications?: SpecificationsDto;

  @ApiPropertyOptional({ 
    description: 'Availability in different project types',
    type: AvailabilityDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto;

  @ApiPropertyOptional({ 
    description: 'Importance level (1-5 scale)',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  importanceLevel?: number;

  @ApiPropertyOptional({ 
    description: 'Popularity score (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  popularityScore?: number;

  @ApiPropertyOptional({ 
    description: 'Related amenity names',
    example: ['Gym', 'Spa', 'Jacuzzi']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedAmenities?: string[];

  @ApiPropertyOptional({ 
    description: 'Search keywords',
    example: ['pool', 'swimming', 'water', 'recreation']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ 
    description: 'SEO title',
    example: 'Swimming Pool - Premium Amenity for Residential Projects',
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ 
    description: 'SEO description',
    example: 'Olympic size swimming pool amenity perfect for luxury residential and commercial projects.',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ 
    description: 'Featured image URL',
    example: 'https://s3.amazonaws.com/bucket/swimming-pool.jpg'
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({ 
    description: 'Gallery image URLs',
    example: ['https://s3.amazonaws.com/bucket/pool-1.jpg', 'https://s3.amazonaws.com/bucket/pool-2.jpg']
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  gallery?: string[];

  // Set masterType to AMENITY
  masterType: MasterType.AMENITY = MasterType.AMENITY;
}
