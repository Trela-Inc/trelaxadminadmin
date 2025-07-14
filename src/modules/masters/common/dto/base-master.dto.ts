import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsNumber, 
  Min, 
  Max, 
  MaxLength,
  IsObject,
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MasterStatus, MasterType } from '../enums/master-types.enum';

/**
 * Base Master DTO
 * Common fields for all master data creation/update
 */
export class BaseMasterDto {
  @ApiProperty({ 
    description: 'Name of the master data entry',
    example: 'Mumbai',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Description of the master data entry',
    example: 'Financial capital of India',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Unique code for the master data entry',
    example: 'MUM',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ 
    description: 'Type of master data',
    enum: MasterType,
    example: MasterType.CITY
  })
  @IsEnum(MasterType)
  masterType: MasterType;

  @ApiPropertyOptional({ 
    description: 'Status of the master data entry',
    enum: MasterStatus,
    default: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus = MasterStatus.ACTIVE;

  @ApiPropertyOptional({ 
    description: 'Sort order for display',
    example: 1,
    minimum: 0,
    maximum: 9999
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999)
  sortOrder?: number;

  @ApiPropertyOptional({ 
    description: 'Whether this is a default option',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Whether this is a popular option',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Additional metadata as key-value pairs',
    example: { color: '#FF5733', icon: 'city-icon' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Master with Parent DTO
 * For master data that has hierarchical relationships
 */
export class MasterWithParentDto extends BaseMasterDto {
  @ApiPropertyOptional({ 
    description: 'Parent master data ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ 
    description: 'Parent master data type',
    enum: MasterType,
    example: MasterType.CITY
  })
  @IsOptional()
  @IsEnum(MasterType)
  parentType?: MasterType;
}

/**
 * Master with Category DTO
 * For master data that has categories
 */
export class MasterWithCategoryDto extends BaseMasterDto {
  @ApiPropertyOptional({ 
    description: 'Category of the master data',
    example: 'basic'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Icon identifier',
    example: 'swimming-pool'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ 
    description: 'Color code',
    example: '#FF5733'
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  color?: string;
}

/**
 * Master with Numeric Value DTO
 * For master data that has numeric values
 */
export class MasterWithNumericValueDto extends BaseMasterDto {
  @ApiPropertyOptional({ 
    description: 'Numeric value',
    example: 2
  })
  @IsOptional()
  @IsNumber()
  numericValue?: number;

  @ApiPropertyOptional({ 
    description: 'Unit of measurement',
    example: 'BHK'
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiPropertyOptional({ 
    description: 'Minimum value',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum value',
    example: 10
  })
  @IsOptional()
  @IsNumber()
  maxValue?: number;
}

/**
 * Master with Location DTO
 * For master data that has geographical information
 */
export class MasterWithLocationDto extends BaseMasterDto {
  @ApiPropertyOptional({ 
    description: 'State name',
    example: 'Maharashtra'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Country name',
    example: 'India'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ 
    description: 'Coordinates [longitude, latitude]',
    example: [72.8777, 19.0760]
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates?: [number, number];

  @ApiPropertyOptional({ 
    description: 'Timezone',
    example: 'Asia/Kolkata'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiPropertyOptional({ 
    description: 'Array of pin codes',
    example: ['400001', '400002', '400003']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pinCodes?: string[];
}
