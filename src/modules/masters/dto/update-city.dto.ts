import { PartialType } from '@nestjs/swagger';
import { CreateCityDto } from './create-city.dto';

/**
 * Data Transfer Object for updating a city
 * Extends CreateCityDto but makes all fields optional
 */
export class UpdateCityDto extends PartialType(CreateCityDto) {}
