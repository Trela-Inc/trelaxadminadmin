import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreatePropertyTypeDto } from './create-property-type.dto';
import { MasterStatus } from '../../common/enums/master-types.enum';

export class UpdatePropertyTypeDto extends PartialType(CreatePropertyTypeDto) {
  @ApiPropertyOptional({ 
    description: 'Status of the property type',
    enum: MasterStatus,
    example: MasterStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(MasterStatus)
  status?: MasterStatus;
}
