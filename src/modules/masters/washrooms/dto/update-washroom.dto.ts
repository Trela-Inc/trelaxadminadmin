import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateWashroomDto } from './create-washroom.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

export class UpdateWashroomDto extends PartialType(CreateWashroomDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the washroom configuration',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
