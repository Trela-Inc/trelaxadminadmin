import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsEnum,
  MaxLength,
  MinLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterStatus } from '../enums/master-type.enum';

/**
 * Data Transfer Object for creating a new city
 */
export class CreateCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'Mumbai',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'State name',
    example: 'Maharashtra',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  state: string;

  @ApiProperty({
    description: 'Country name',
    example: 'India',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({
    description: 'City code (e.g., MUM for Mumbai)',
    example: 'MUM',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  code?: string;

  @ApiPropertyOptional({
    description: 'City description',
    example: 'Financial capital of India',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'GPS coordinates [longitude, latitude]',
    example: [72.8777, 19.0760],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates?: [number, number];

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'Asia/Kolkata',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Common pin codes in this city',
    example: ['400001', '400002', '400003'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pinCodes?: string[];

  @ApiPropertyOptional({
    description: 'City status',
    enum: MasterStatus,
    default: MasterStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Mark as popular city',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}
