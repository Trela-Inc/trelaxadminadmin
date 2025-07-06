import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength,
  IsOptional,
  IsEnum,
  Matches 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


/**
 * Data Transfer Object for user registration
 * Validates all required fields for creating a new user account
 */
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters, must contain at least one letter and one number)',
    example: 'SecurePassword123!',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
    { message: 'Password must contain at least one letter and one number' }
  )
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Matches(
    /^\+?[1-9]\d{1,14}$/,
    { message: 'Please provide a valid phone number' }
  )
  phoneNumber?: string;
}
