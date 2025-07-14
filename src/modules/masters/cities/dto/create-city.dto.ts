import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  MaxLength
} from 'class-validator';



/**
 * Create City DTO - Simplified
 * Only requires city name, all other fields are optional
 */
export class CreateCityDto {
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

  @ApiPropertyOptional({
    description: 'State name',
    example: 'Maharashtra',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({
    description: 'Country name',
    example: 'India',
    maxLength: 100,
    default: 'India'
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

}
