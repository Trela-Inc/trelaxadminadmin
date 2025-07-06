import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

/**
 * Authentication module
 * Handles JWT authentication, login, registration, and auth guards
 */
@Module({
  imports: [
    // Import UsersModule to access user service
    
    
    // Passport configuration
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false,
    }),
    
    // JWT module configuration (already global, but imported for clarity)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    LocalAuthGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}
