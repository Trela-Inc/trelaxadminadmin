import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  MaxLength,
  MinLength,
  Matches
} from 'class-validator';

/**
 * Create Builder DTO
 * Data Transfer Object for creating new builders
 */
export class CreateBuilderDto {
  @ApiProperty({
    example: 'ABC Builders',
    description: 'Name of the builder',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({
    description: 'Builder description',
    example: 'Leading real estate developer with 20+ years of experience in luxury residential and commercial projects',
    maxLength: 1000
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Builder website URL',
    example: 'https://abcconstructions.com',
    format: 'url'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  website?: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'info@abcconstructions.com',
    format: 'email'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+91-9876543210',
    pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,15}$'
  })
  @IsOptional()
  @IsString({ message: 'Contact phone must be a string' })
  @Matches(/^[+]?[0-9\s\-\(\)]{10,15}$/, {
    message: 'Please provide a valid phone number'
  })
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Builder logo URL',
    example: 'https://s3.amazonaws.com/bucket/builders/logo.jpg',
    format: 'url'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for logo' })
  logo?: string;
}