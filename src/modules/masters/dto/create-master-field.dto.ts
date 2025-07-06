import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsMongoId,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MasterFieldType, MasterStatus } from '../enums/master-type.enum';

/**
 * Data Transfer Object for creating a new master field
 */
export class CreateMasterFieldDto {
  @ApiProperty({
    description: 'Type of master field',
    enum: MasterFieldType,
    example: MasterFieldType.AMENITY,
  })
  @IsEnum(MasterFieldType)
  @IsNotEmpty()
  fieldType: MasterFieldType;

  @ApiProperty({
    description: 'Field name/label',
    example: 'Swimming Pool',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Field description',
    example: 'Olympic size swimming pool',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Field value (for numeric fields like bedroom count)',
    example: '3',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  value?: string;

  @ApiPropertyOptional({
    description: 'Field status',
    enum: MasterStatus,
    default: MasterStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;

  @ApiPropertyOptional({
    description: 'Sort order for dropdown display',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Mark as default selection',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Parent field ID (for hierarchical data like locations under cities)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  parentId?: string;
}
