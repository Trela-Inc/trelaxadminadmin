import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsMongoId,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterStatus } from '../enums/master-type.enum';

/**
 * Data Transfer Object for creating a new location
 */
export class CreateLocationDto {
  @ApiProperty({
    description: 'Location name',
    example: 'Bandra West',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'City ID this location belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  cityId: string;

  @ApiPropertyOptional({
    description: 'Area/Zone within the location',
    example: 'Linking Road',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;

  @ApiPropertyOptional({
    description: 'Location description',
    example: 'Premium residential and commercial area',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'GPS coordinates [longitude, latitude]',
    example: [72.8265, 19.0596],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates?: [number, number];

  @ApiPropertyOptional({
    description: 'Pin codes for this location',
    example: ['400050', '400051'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pinCodes?: string[];

  @ApiPropertyOptional({
    description: 'Famous landmarks in this location',
    example: ['Bandra-Worli Sea Link', 'Bandstand Promenade'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  landmarks?: string[];

  @ApiPropertyOptional({
    description: 'Connectivity options',
    example: ['Bandra Station', 'Western Express Highway'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  connectivity?: string[];

  @ApiPropertyOptional({
    description: 'Location status',
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
    description: 'Mark as popular location',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional({
    description: 'Average price per sq ft in this location',
    example: 25000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averagePrice?: number;

  @ApiPropertyOptional({
    description: 'Nearby facilities',
    example: ['Schools', 'Hospitals', 'Shopping Malls'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nearbyFacilities?: string[];
}
