import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsUrl,
  MaxLength,
  MinLength,
  Matches
} from 'class-validator';

/**
 * Create Agent DTO
 * Data Transfer Object for creating new agents
 */
export class CreateAgentDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the agent',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({
    description: 'Agent description',
    example: 'Experienced real estate agent with 10+ years in luxury properties',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Agent email address',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+91-9876543210',
    pattern: '^[+]?[0-9\\s\\-\\(\\)]{10,15}$'
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^[+]?[0-9\s\-\(\)]{10,15}$/, {
    message: 'Please provide a valid phone number'
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Agent address',
    example: '123 Main Street, Bandra West, Mumbai, Maharashtra 400050',
    maxLength: 300
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(300, { message: 'Address must not exceed 300 characters' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Agent license number',
    example: 'RE123456',
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'License number must be a string' })
  @MaxLength(50, { message: 'License number must not exceed 50 characters' })
  licenseNumber?: string;

  @ApiPropertyOptional({
    description: 'Agent profile image URL',
    example: 'https://s3.amazonaws.com/bucket/agents/profile.jpg',
    format: 'url'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for profile image' })
  profileImage?: string;

  @ApiPropertyOptional({
    description: 'Agent active status',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}