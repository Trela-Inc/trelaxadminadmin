import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseUtil } from '../../common/utils/response.util';
import {
  ApiSuccessResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '../../common/decorators/api-response.decorator';

/**
 * Authentication controller
 * Handles admin authentication endpoints (login, profile)
 */
@ApiTags('🔐 Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Admin login endpoint
   */
  @Post('login')
  @ApiOperation({
    summary: '🔑 Admin Login',
    description: `
**Authenticate admin user and get JWT token**

Use one of the predefined admin accounts:
- admin@trelax.com / admin123
- superadmin@trelax.com / admin123
- manager@trelax.com / admin123

The returned JWT token should be used in the Authorization header for all other API calls.
    `
  })
  @ApiSuccessResponse({
    description: 'Login successful - Returns user info and JWT token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Login successful' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'admin1' },
                email: { type: 'string', example: 'admin@trelax.com' },
                firstName: { type: 'string', example: 'Admin' },
                lastName: { type: 'string', example: 'User' },
                role: { type: 'string', example: 'admin' },
                isActive: { type: 'boolean', example: true },
              },
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  description: 'JWT token to be used in Authorization header'
                },
              },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid input data or missing required fields')
  @ApiUnauthorizedResponse('Invalid email or password - Check credentials')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return ResponseUtil.success(result, 'Login successful');
  }



  /**
   * Get current admin profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get Admin Profile',
    description: 'Get current authenticated admin profile information'
  })
  @ApiSuccessResponse({
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Profile retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getProfile(@Request() req: any) {
    const profile = await this.authService.getProfile(req.user.id);
    return ResponseUtil.success(profile, 'Profile retrieved successfully');
  }

  /**
   * Refresh JWT token
   */
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Generate new access token for authenticated admin'
  })
  @ApiSuccessResponse({
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token refreshed successfully' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async refreshToken(@Request() req: any) {
    const result = await this.authService.refreshToken(req.user.id);
    return ResponseUtil.success(result, 'Token refreshed successfully');
  }
}
