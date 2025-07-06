import { PartialType } from '@nestjs/swagger';
import { CreateMasterFieldDto } from './create-master-field.dto';

/**
 * Data Transfer Object for updating a master field
 * Extends CreateMasterFieldDto but makes all fields optional
 */
export class UpdateMasterFieldDto extends PartialType(CreateMasterFieldDto) {}
