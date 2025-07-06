import { PartialType } from '@nestjs/swagger';
import { CreateBuilderDto } from './create-builder.dto.js';

/**
 * Data Transfer Object for updating a builder
 * Extends CreateBuilderDto but makes all fields optional
 */
export class UpdateBuilderDto extends PartialType(CreateBuilderDto) {}
