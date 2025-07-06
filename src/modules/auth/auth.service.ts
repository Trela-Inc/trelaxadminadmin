import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

/**
 * Authentication service
 * Handles admin authentication with predefined admin accounts
 */
@Injectable()
export class AuthService {
  private readonly adminAccounts = [
    {
      id: 'admin1',
      email: 'admin@trelax.com',
      password: '$2a$12$LQv3c1yqBwEHxPiLnPZOQOsOHm5XQZQX5QzQX5QzQX5QzQX5QzQX5Q', // password: admin123
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
    {
      id: 'admin2',
      email: 'superadmin@trelax.com',
      password: '$2a$12$LQv3c1yqBwEHxPiLnPZOQOsOHm5XQZQX5QzQX5QzQX5QzQX5QzQX5Q', // password: admin123
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
    },
    {
      id: 'admin3',
      email: 'manager@trelax.com',
      password: '$2a$12$LQv3c1yqBwEHxPiLnPZOQOsOHm5XQZQX5QzQX5QzQX5QzQX5QzQX5Q', // password: admin123
      firstName: 'Manager',
      lastName: 'User',
      role: 'admin',
    },
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Hash the default password on startup
    this.initializeAdminPasswords();
  }

  private async initializeAdminPasswords() {
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    // Update all admin passwords with the hashed version
    this.adminAccounts.forEach(admin => {
      admin.password = hashedPassword;
    });
  }

  /**
   * Validate admin credentials
   */
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const admin = this.adminAccounts.find(acc => acc.email === email);

      if (!admin) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return null;
      }

      // Return admin without password
      const { password: _, ...result } = admin;
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Login admin and return JWT token
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const admin = await this.validateUser(email, password);

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        isActive: true,
      },
      tokens: {
        accessToken,
      },
    };
  }


  /**
   * Validate JWT token and return admin
   */
  async validateJwtPayload(payload: any): Promise<any> {
    const admin = this.adminAccounts.find(acc => acc.id === payload.sub);

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    // Return admin without password
    const { password: _, ...result } = admin;
    return result;
  }

  /**
   * Get admin profile (no registration needed - admins are predefined)
   */
  async getProfile(adminId: string) {
    const admin = this.adminAccounts.find(acc => acc.id === adminId);

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      isActive: true,
    };
  }

  /**
   * Generate new access token for admin
   */
  async refreshToken(adminId: string) {
    const admin = this.adminAccounts.find(acc => acc.id === adminId);

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
