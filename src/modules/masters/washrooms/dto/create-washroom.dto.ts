import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  IsBoolean,
  IsEnum,
  Min,
  Max,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { MasterWithNumericValueDto } from '../../common/dto/base-master.dto';
import { MasterType } from '../../common/enums/master-types.enum';

export class WashroomSpecificationsDto {
  @ApiPropertyOptional({ description: 'Has shower', example: true })
  @IsOptional()
  @IsBoolean()
  hasShower?: boolean;

  @ApiPropertyOptional({ description: 'Has bathtub', example: false })
  @IsOptional()
  @IsBoolean()
  hasBathtub?: boolean;

  @ApiPropertyOptional({ description: 'Has geyser', example: true })
  @IsOptional()
  @IsBoolean()
  hasGeyser?: boolean;

  @ApiPropertyOptional({ description: 'Has exhaust fan', example: true })
  @IsOptional()
  @IsBoolean()
  hasExhaustFan?: boolean;

  @ApiPropertyOptional({ description: 'Has window', example: true })
  @IsOptional()
  @IsBoolean()
  hasWindow?: boolean;

  @ApiPropertyOptional({ 
    description: 'Fittings quality',
    enum: ['basic', 'premium', 'luxury'],
    example: 'premium'
  })
  @IsOptional()
  @IsEnum(['basic', 'premium', 'luxury'])
  fittingsQuality?: string;
}

export class CreateWashroomDto extends MasterWithNumericValueDto {
  @ApiProperty({ description: 'Washroom configuration name', example: '2 Bathrooms' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Washroom description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Washroom code', example: '2BATH' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ description: 'Number of washrooms', example: 2 })
  @IsNumber()
  @Min(0)
  @Max(10)
  numericValue: number;

  @ApiPropertyOptional({ description: 'Unit type', default: 'Bathroom' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string = 'Bathroom';

  @ApiPropertyOptional({ 
    description: 'Washroom type',
    enum: ['attached', 'common', 'powder_room', 'master_bathroom', 'guest_bathroom']
  })
  @IsOptional()
  @IsEnum(['attached', 'common', 'powder_room', 'master_bathroom', 'guest_bathroom'])
  washroomType?: string;

  @ApiPropertyOptional({ 
    description: 'Washroom features', 
    example: ['bathtub', 'shower', 'geyser', 'exhaust_fan'] 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ description: 'Typical area in sq ft', example: 40 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  typicalArea?: number;

  @ApiPropertyOptional({ description: 'Popularity rating (1-5)', example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  popularityRating?: number;

  @ApiPropertyOptional({ type: WashroomSpecificationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WashroomSpecificationsDto)
  specifications?: WashroomSpecificationsDto;

  masterType: MasterType.WASHROOM = MasterType.WASHROOM;
}
