import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateFloorDto } from './create-floor.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

/**
 * Update Floor DTO
 * All fields from CreateFloorDto are optional for updates
 */
export class UpdateFloorDto extends PartialType(CreateFloorDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the floor',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
