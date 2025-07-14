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

export class TowerSpecificationsDto {
  @ApiPropertyOptional({ description: 'Structure type', example: 'RCC' })
  @IsOptional()
  @IsString()
  structure?: string;

  @ApiPropertyOptional({ description: 'Number of elevators', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  elevators?: number;

  @ApiPropertyOptional({ description: 'Number of staircases', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  staircases?: number;

  @ApiPropertyOptional({ description: 'Parking levels', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  parkingLevels?: number;

  @ApiPropertyOptional({ description: 'Total parking spots', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalParkingSpots?: number;

  @ApiPropertyOptional({ description: 'Power backup available', example: true })
  @IsOptional()
  @IsBoolean()
  powerBackup?: boolean;

  @ApiPropertyOptional({ description: 'Water storage capacity in liters', example: 50000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waterStorage?: number;

  @ApiPropertyOptional({ description: 'Sewage treatment plant', example: true })
  @IsOptional()
  @IsBoolean()
  sewageTreatment?: boolean;

  @ApiPropertyOptional({ description: 'Rainwater harvesting', example: true })
  @IsOptional()
  @IsBoolean()
  rainwaterHarvesting?: boolean;

  @ApiPropertyOptional({ description: 'Solar panels installed', example: true })
  @IsOptional()
  @IsBoolean()
  solarPanels?: boolean;

  @ApiPropertyOptional({ description: 'Green building certified', example: true })
  @IsOptional()
  @IsBoolean()
  greenBuilding?: boolean;
}

export class CreateTowerDto extends MasterWithNumericValueDto {
  @ApiProperty({ description: 'Tower name', example: 'Tower A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Tower description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Tower code', example: 'TA' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ description: 'Tower number', example: 1 })
  @IsNumber()
  @Min(1)
  numericValue: number;

  @ApiPropertyOptional({ description: 'Unit type', default: 'Tower' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string = 'Tower';

  @ApiPropertyOptional({ 
    description: 'Tower type',
    enum: ['residential', 'commercial', 'mixed_use', 'office', 'retail', 'hospitality', 'industrial']
  })
  @IsOptional()
  @IsEnum(['residential', 'commercial', 'mixed_use', 'office', 'retail', 'hospitality', 'industrial'])
  towerType?: string;

  @ApiPropertyOptional({ description: 'Total floors', example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  totalFloors?: number;

  @ApiPropertyOptional({ description: 'Tower height in feet', example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  height?: number;

  @ApiPropertyOptional({ description: 'Total units', example: 160 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalUnits?: number;

  @ApiPropertyOptional({ description: 'Units per floor', example: 8 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  unitsPerFloor?: number;

  @ApiPropertyOptional({ type: TowerSpecificationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TowerSpecificationsDto)
  specifications?: TowerSpecificationsDto;

  @ApiPropertyOptional({ description: 'Tower amenities', example: ['Gym', 'Pool'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Special features', example: ['Sea View', 'Corner Units'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ description: 'Tower is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Construction year', example: 2023 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2030)
  constructionYear?: number;

  @ApiPropertyOptional({ description: 'Architect name', example: 'ABC Architects' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  architect?: string;

  @ApiPropertyOptional({ description: 'Contractor name', example: 'XYZ Builders' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contractor?: string;

  masterType: MasterType.TOWER = MasterType.TOWER;
}
