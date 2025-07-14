import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateLocationDto } from './create-location.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

/**
 * Update Location DTO
 * All fields from CreateLocationDto are optional for updates
 */
export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @ApiPropertyOptional({
    description: 'Status of the location',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}