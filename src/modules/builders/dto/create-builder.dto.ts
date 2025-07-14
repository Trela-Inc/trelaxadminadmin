import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBuilderDto {
  @ApiProperty({ example: 'ABC Builders', description: 'Name of the builder' })
  name: string;

  @ApiPropertyOptional({ description: 'Builder description', example: 'Leading real estate developer' })
  description?: string;

  @ApiPropertyOptional({ description: 'Builder website', example: 'https://abcconstructions.com' })
  website?: string;

  @ApiPropertyOptional({ description: 'Contact email', example: 'info@abcconstructions.com' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '+91-9876543210' })
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Builder logo URL', example: 'https://s3.amazonaws.com/bucket/logo.jpg' })
  logo?: string;
} 