import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateAmenityDto } from './create-amenity.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

/**
 * Update Amenity DTO
 * All fields from CreateAmenityDto are optional for updates
 */
export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the amenity',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
