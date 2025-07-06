import { IsOptional, IsEnum, IsString, IsBoolean, IsNumber, Min, Max, IsMongoId } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MasterFieldType, MasterStatus } from '../enums/master-type.enum';

/**
 * Data Transfer Object for querying master fields with filters and pagination
 */
export class QueryMasterFieldDto {
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
    description: 'Search term for name or description',
    example: 'swimming',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by field type',
    enum: MasterFieldType,
    example: MasterFieldType.AMENITY,
  })
  @IsOptional()
  @IsEnum(MasterFieldType, { message: 'Field type must be a valid type' })
  fieldType?: MasterFieldType;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(MasterStatus, { message: 'Status must be a valid status' })
  status?: MasterStatus;

  @ApiPropertyOptional({
    description: 'Filter by parent ID (for hierarchical data)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId({ message: 'Parent ID must be a valid MongoDB ObjectId' })
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by default items only',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isDefault must be a boolean value' })
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'sortOrder',
    enum: ['name', 'createdAt', 'updatedAt', 'sortOrder'],
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: string = 'sortOrder';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  sortOrder?: 'asc' | 'desc' = 'asc';
}
