import { IsOptional, IsEnum, IsString, IsBoolean, IsNumber, Min, Max, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus, PropertyType, UnitType, ApprovalStatus } from '../enums/project-status.enum';

/**
 * Data Transfer Object for querying projects with filters and pagination
 */
export class QueryProjectDto {
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
    description: 'Search term for project name or description',
    example: 'luxury',
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by project status',
    enum: ProjectStatus,
    example: ProjectStatus.UNDER_CONSTRUCTION,
  })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  projectStatus?: ProjectStatus;

  @ApiPropertyOptional({
    description: 'Filter by property type',
    enum: PropertyType,
    example: PropertyType.RESIDENTIAL,
  })
  @IsOptional()
  @IsEnum(PropertyType, { message: 'Property type must be a valid type' })
  propertyType?: PropertyType;

  @ApiPropertyOptional({
    description: 'Filter by city',
    example: 'Mumbai',
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @ApiPropertyOptional({
    description: 'Filter by state',
    example: 'Maharashtra',
  })
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string;

  @ApiPropertyOptional({
    description: 'Filter by builder name',
    example: 'ABC Constructions',
  })
  @IsOptional()
  @IsString({ message: 'Builder must be a string' })
  builder?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum price',
    example: 1000000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price must be at least 0' })
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum price',
    example: 10000000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price must be at least 0' })
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Filter by minimum bedrooms',
    example: 2,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Minimum bedrooms must be a number' })
  @Min(0, { message: 'Minimum bedrooms must be at least 0' })
  bedroomsMin?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum bedrooms',
    example: 4,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum bedrooms must be a number' })
  @Min(0, { message: 'Maximum bedrooms must be at least 0' })
  bedroomsMax?: number;

  @ApiPropertyOptional({
    description: 'Filter by unit type',
    enum: UnitType,
    example: UnitType.APARTMENT,
  })
  @IsOptional()
  @IsEnum(UnitType, { message: 'Unit type must be a valid type' })
  unitType?: UnitType;

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
    description: 'Filter by featured status',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isFeatured must be a boolean value' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by approval status',
    enum: ApprovalStatus,
    example: ApprovalStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(ApprovalStatus, { message: 'Approval status must be a valid status' })
  approvalStatus?: ApprovalStatus;

  @ApiPropertyOptional({
    description: 'Filter by amenities (comma-separated)',
    example: 'Swimming Pool,Gym,Garden',
  })
  @IsOptional()
  @IsString({ message: 'Amenities must be a string' })
  amenities?: string;

  @ApiPropertyOptional({
    description: 'Filter by tags (comma-separated)',
    example: 'luxury,gated-community',
  })
  @IsOptional()
  @IsString({ message: 'Tags must be a string' })
  tags?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'projectName', 'priceMin', 'priceMax', 'viewCount'],
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

  @ApiPropertyOptional({
    description: 'Latitude for location-based search',
    example: 19.0760,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude for location-based search',
    example: 72.8777,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Radius for location-based search in kilometers',
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Radius must be a number' })
  @Min(0, { message: 'Radius must be at least 0' })
  @Max(100, { message: 'Radius must not exceed 100 km' })
  radius?: number;
}
