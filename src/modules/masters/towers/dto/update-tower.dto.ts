import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateTowerDto } from './create-tower.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

export class UpdateTowerDto extends PartialType(CreateTowerDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the tower',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
