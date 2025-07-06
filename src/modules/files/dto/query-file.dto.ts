import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for querying files with filters and pagination
 */
export class QueryFileDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for filename or description',
    example: 'profile',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by file category',
    enum: ['image', 'document', 'video', 'audio', 'archive', 'other'],
    example: 'image',
  })
  @IsOptional()
  @IsEnum(['image', 'document', 'video', 'audio', 'archive', 'other'], {
    message: 'Category must be a valid file category'
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by public status',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isPublic must be a boolean value' })
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by uploader user ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString({ message: 'uploadedBy must be a string' })
  uploadedBy?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'filename', 'size', 'downloadCount'],
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
