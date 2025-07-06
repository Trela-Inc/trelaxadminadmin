import { PartialType } from '@nestjs/swagger';
import { CreateAmenityDto } from './create-amenity.dto.js';

/**
 * Data Transfer Object for updating an amenity
 * Extends CreateAmenityDto but makes all fields optional
 */
export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {}
