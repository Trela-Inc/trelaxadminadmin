import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MasterStatus } from '../enums/master-types.enum';

/**
 * Base Query Master DTO
 * Common query parameters for all master data endpoints
 */
export class QueryMasterDto {
  @ApiPropertyOptional({ 
    description: 'Page number for pagination',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Search term for name and description',
    example: 'Mumbai'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by status',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by default items only',
    example: true
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filter by popular items only',
    example: true
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional({ 
    description: 'Field to sort by',
    example: 'name',
    enum: ['name', 'createdAt', 'updatedAt', 'sortOrder']
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'sortOrder';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}

/**
 * Query Master with Parent DTO
 * For master data that has hierarchical relationships
 */
export class QueryMasterWithParentDto extends QueryMasterDto {
  @ApiPropertyOptional({ 
    description: 'Filter by parent ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

/**
 * Query Master with Category DTO
 * For master data that has categories
 */
export class QueryMasterWithCategoryDto extends QueryMasterDto {
  @ApiPropertyOptional({ 
    description: 'Filter by category',
    example: 'basic'
  })
  @IsOptional()
  @IsString()
  category?: string;
}

/**
 * Query Master with Numeric Range DTO
 * For master data that has numeric values with range filtering
 */
export class QueryMasterWithNumericRangeDto extends QueryMasterDto {
  @ApiPropertyOptional({ 
    description: 'Minimum numeric value',
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional({ 
    description: 'Maximum numeric value',
    example: 5
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;

  @ApiPropertyOptional({ 
    description: 'Filter by unit',
    example: 'BHK'
  })
  @IsOptional()
  @IsString()
  unit?: string;
}

/**
 * Query Master with Location DTO
 * For master data that has geographical filtering
 */
export class QueryMasterWithLocationDto extends QueryMasterDto {
  @ApiPropertyOptional({ 
    description: 'Filter by state',
    example: 'Maharashtra'
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by country',
    example: 'India'
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by pin code',
    example: '400001'
  })
  @IsOptional()
  @IsString()
  pinCode?: string;
}
