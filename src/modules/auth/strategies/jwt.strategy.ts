import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * JWT Strategy for Passport authentication
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate JWT payload and return user object
   * This method is called automatically by Passport when a valid JWT is provided
   */
  async validate(payload: any) {
    try {
      // Payload contains: { sub: userId, email: userEmail, role: userRole, iat: timestamp, exp: timestamp }
      const user = await this.authService.validateJwtPayload(payload);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Return user object (will be available as req.user in controllers)
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
