import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the agent' })
  name: string;

  @ApiPropertyOptional({ description: 'Agent description', example: 'Experienced real estate agent' })
  description?: string;

  @ApiPropertyOptional({ description: 'Agent email', example: 'john.doe@example.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '+91-9876543210' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Agent address', example: '123 Main Street, City, State' })
  address?: string;

  @ApiPropertyOptional({ description: 'Agent license number', example: 'RE123456' })
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'Agent profile image URL', example: 'https://s3.amazonaws.com/bucket/profile.jpg' })
  profileImage?: string;

  @ApiPropertyOptional({ description: 'Agent active status', example: true })
  isActive?: boolean;
} 