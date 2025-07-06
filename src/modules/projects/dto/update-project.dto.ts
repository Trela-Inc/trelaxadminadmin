import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

/**
 * Data Transfer Object for updating a project
 * Extends CreateProjectDto but makes all fields optional
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  // All fields from CreateProjectDto are now optional
}
