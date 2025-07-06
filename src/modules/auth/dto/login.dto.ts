import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user login
 * Validates email and password input for authentication
 */
export class LoginDto {
  @ApiProperty({
    description: 'Admin email address - Use one of the predefined admin accounts',
    example: 'admin@trelax.com',
    format: 'email',
    examples: {
      admin: {
        value: 'admin@trelax.com',
        description: 'Standard admin account'
      },
      superadmin: {
        value: 'superadmin@trelax.com',
        description: 'Super admin account with full privileges'
      },
      manager: {
        value: 'manager@trelax.com',
        description: 'Manager admin account'
      }
    }
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Admin password - Default password for all admin accounts is "admin123"',
    example: 'admin123',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
