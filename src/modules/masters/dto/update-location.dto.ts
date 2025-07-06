import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';

/**
 * Data Transfer Object for updating a location
 * Extends CreateLocationDto but makes all fields optional
 */
export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
