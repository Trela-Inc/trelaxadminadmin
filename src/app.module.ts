import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MastersModule } from './modules/masters/masters.module';
import { FilesModule } from './modules/files/files.module';
/**
 * Root application module that configures all global modules and dependencies
 * Includes MongoDB connection, JWT authentication, file upload configuration
 */
@Module({
  imports: [
    // Global configuration module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app
      envFilePath: '.env', // Path to environment file
      cache: true, // Cache environment variables for better performance
    }),

    // MongoDB connection using Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        
        if (!uri) {
          throw new Error('MONGO_URI is not defined in environment variables');
        }

        return {
          uri,
          // Connection options for better performance and reliability
          // useNewUrlParser: true, // Deprecated, remove
          // useUnifiedTopology: true, // Deprecated, remove
          maxPoolSize: 10, // Maintain up to 10 socket connections
          serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
          socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
          // bufferMaxEntries: 0, // Disable mongoose buffering (removed, deprecated)
          bufferCommands: false, // Disable mongoose buffering
        };
      },
      inject: [ConfigService],
    }),

    // Global JWT module configuration
    JwtModule.registerAsync({
      global: true, // Makes JwtService available throughout the app
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
          },
        };
      },
      inject: [ConfigService],
    }),

    // Passport module for authentication strategies
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false, // Disable sessions for stateless JWT authentication
    }),

    // Global Multer configuration for file uploads
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // File size limit (10MB)
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB in bytes
        },
        // File filter for allowed file types
        fileFilter: (req, file, callback) => {
          // Allow common file types
          const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ];
          
          if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
          } else {
            callback(new Error('Invalid file type'), false);
          }
        },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule, // Authentication module (JWT strategies, guards)
    // File upload and management module
    ProjectsModule, // Real estate projects management module
    MastersModule, // Master data management module (cities, locations, amenities, builders)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Log important configuration on startup
    console.log('🔧 Application Configuration:');
    console.log(`   - Environment: ${this.configService.get('NODE_ENV', 'development')}`);
    console.log(`   - Port: ${this.configService.get('PORT', 3000)}`);
    console.log(`   - API Prefix: ${this.configService.get('API_PREFIX', 'api/v1')}`);
    console.log(`   - MongoDB: ${this.configService.get('MONGO_URI') ? '✅ Connected' : '❌ Not configured'}`);
    console.log(`   - JWT: ${this.configService.get('JWT_SECRET') ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`   - AWS S3: ${this.configService.get('AWS_S3_BUCKET') ? '✅ Configured' : '❌ Not configured'}`);
  }
}
