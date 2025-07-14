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
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { MasterWithNumericValueDto } from '../../common/dto/base-master.dto';
import { MasterType } from '../../common/enums/master-types.enum';

/**
 * Specifications DTO
 */
export class FloorSpecificationsDto {
  @ApiPropertyOptional({ 
    description: 'Ceiling height in feet',
    example: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(30)
  ceilingHeight?: number;

  @ApiPropertyOptional({ 
    description: 'Load capacity in kg/sq meter',
    example: 500
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  loadCapacity?: number;

  @ApiPropertyOptional({ 
    description: 'Fire safety rating',
    example: 'Class A'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fireRating?: string;

  @ApiPropertyOptional({ 
    description: 'Wheelchair accessible',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  accessibility?: boolean;

  @ApiPropertyOptional({ 
    description: 'HVAC system type',
    example: 'Central Air Conditioning'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  hvacType?: string;

  @ApiPropertyOptional({ 
    description: 'Electrical load capacity in KW',
    example: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  electricalLoad?: number;
}

/**
 * Amenities DTO
 */
export class FloorAmenitiesDto {
  @ApiPropertyOptional({ 
    description: 'Elevator access available',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  elevator?: boolean;

  @ApiPropertyOptional({ 
    description: 'Escalator access available',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  escalator?: boolean;

  @ApiPropertyOptional({ 
    description: 'Fire exit available',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  fireExit?: boolean;

  @ApiPropertyOptional({ 
    description: 'Emergency staircase available',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  emergencyStaircase?: boolean;

  @ApiPropertyOptional({ 
    description: 'Restrooms available',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  restrooms?: boolean;

  @ApiPropertyOptional({ 
    description: 'Power backup available',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  powerBackup?: boolean;
}

/**
 * Create Floor DTO
 * Extends MasterWithNumericValueDto with floor-specific fields
 */
export class CreateFloorDto extends MasterWithNumericValueDto {
  @ApiProperty({ 
    description: 'Floor name',
    example: '1st Floor',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Floor description',
    example: 'First floor with residential units',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Unique floor code',
    example: '1F',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ 
    description: 'Floor number (0 for ground, negative for basement)',
    example: 1
  })
  @IsNumber()
  numericValue: number;

  @ApiPropertyOptional({ 
    description: 'Unit type',
    example: 'Floor',
    maxLength: 20,
    default: 'Floor'
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string = 'Floor';

  @ApiPropertyOptional({ 
    description: 'Floor type',
    example: 'regular',
    enum: ['basement', 'ground', 'mezzanine', 'regular', 'penthouse', 'rooftop', 'parking', 'mechanical', 'terrace']
  })
  @IsOptional()
  @IsEnum(['basement', 'ground', 'mezzanine', 'regular', 'penthouse', 'rooftop', 'parking', 'mechanical', 'terrace'])
  floorType?: string;

  @ApiPropertyOptional({ 
    description: 'Primary usage of the floor',
    example: 'residential',
    enum: ['residential', 'commercial', 'mixed', 'parking', 'amenity', 'mechanical', 'retail', 'office']
  })
  @IsOptional()
  @IsEnum(['residential', 'commercial', 'mixed', 'parking', 'amenity', 'mechanical', 'retail', 'office'])
  usage?: string;

  @ApiPropertyOptional({ 
    description: 'Floor height in feet',
    example: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(6)
  @Max(30)
  height?: number;

  @ApiPropertyOptional({ 
    description: 'Floor area in square feet',
    example: 5000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiPropertyOptional({ 
    description: 'Floor specifications',
    type: FloorSpecificationsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FloorSpecificationsDto)
  specifications?: FloorSpecificationsDto;

  @ApiPropertyOptional({ 
    description: 'Floor amenities',
    type: FloorAmenitiesDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FloorAmenitiesDto)
  amenities?: FloorAmenitiesDto;

  @ApiPropertyOptional({ 
    description: 'Usage restrictions',
    example: ['No heavy machinery', 'Noise restrictions after 10 PM']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictions?: string[];

  @ApiPropertyOptional({ 
    description: 'Special features',
    example: ['High ceilings', 'Natural lighting', 'Balcony access']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ 
    description: 'Price multiplier compared to base floor',
    example: 1.2
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  priceMultiplier?: number;

  @ApiPropertyOptional({ 
    description: 'Premium percentage for this floor',
    example: 15
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  premiumPercentage?: number;

  @ApiPropertyOptional({ 
    description: 'Floor is available for booking',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Maximum units per floor',
    example: 8
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxUnitsPerFloor?: number;

  @ApiPropertyOptional({ 
    description: 'Display name for UI',
    example: '1st Floor',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({ 
    description: 'Short description for listings',
    example: 'Premium residential floor with city views',
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  shortDescription?: string;

  // Set masterType to FLOOR
  masterType: MasterType.FLOOR = MasterType.FLOOR;
}
