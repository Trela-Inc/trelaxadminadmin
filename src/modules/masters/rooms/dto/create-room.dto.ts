import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  IsEnum,
  Min,
  Max,
  MaxLength
} from 'class-validator';
import { MasterWithNumericValueDto } from '../../common/dto/base-master.dto';
import { MasterType } from '../../common/enums/master-types.enum';

export class CreateRoomDto extends MasterWithNumericValueDto {
  @ApiProperty({ description: 'Room configuration name', example: '2 BHK' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Room description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Room code', example: '2BHK' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiProperty({ description: 'Number of rooms', example: 2 })
  @IsNumber()
  @Min(0)
  @Max(10)
  numericValue: number;

  @ApiPropertyOptional({ description: 'Unit type', default: 'BHK' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string = 'BHK';

  @ApiPropertyOptional({ 
    description: 'Room type',
    enum: ['studio', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', 'penthouse']
  })
  @IsOptional()
  @IsEnum(['studio', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', 'penthouse'])
  roomType?: string;

  @ApiPropertyOptional({ description: 'Room features', example: ['Master Bedroom', 'Attached Bathroom'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ description: 'Typical area in sq ft', example: 1200 })
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

  masterType: MasterType.ROOM = MasterType.ROOM;
}
