import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateCityDto } from './create-city.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

/**
 * Update City DTO
 * All fields from CreateCityDto are optional for updates
 */
export class UpdateCityDto extends PartialType(CreateCityDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the city',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
