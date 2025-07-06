import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Root application service
 * Provides basic application functionality and information
 */
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Returns application health status and basic information
   */
  getHello() {
    return {
      message: 'TrelaX Core Admin Backend API is running successfully! 🚀',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV', 'development'),
    };
  }

  /**
   * Returns API information and available endpoints
   */
  getApiInfo() {
    const apiPrefix = this.configService.get('API_PREFIX', 'api/v1');
    const port = this.configService.get('PORT', 3000);
    const baseUrl = `http://localhost:${port}/${apiPrefix}`;

    return {
      name: 'TrelaX Core Admin Backend API',
      version: '1.0.0',
      description: 'Complete NestJS monolith backend with Users and Files modules',
      endpoints: {
        users: `${baseUrl}/users`,
        files: `${baseUrl}/files`,
        auth: `${baseUrl}/auth`,
        docs: `${baseUrl}/docs`,
      },
      features: [
        'User Management with JWT Authentication',
        'File Upload with AWS S3 Integration',
        'MongoDB Database Integration',
        'Swagger API Documentation',
        'Input Validation and Error Handling',
        'CORS Support',
        'Environment Configuration',
      ],
    };
  }
}
