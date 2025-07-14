import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the room configuration',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
