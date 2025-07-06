import { IsOptional, IsString, IsArray, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for file upload
 * Validates optional metadata for uploaded files
 */
export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'File description',
    example: 'Profile picture for user account',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'File tags for organization',
    example: ['profile', 'image', 'user'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Whether the file should be publicly accessible',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic must be a boolean value' })
  isPublic?: boolean;
}
