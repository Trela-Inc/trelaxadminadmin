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
      description: 'Complete Real Estate Management Backend with comprehensive modules',
      endpoints: {
        auth: `${baseUrl}/auth`,
        projects: `${baseUrl}/projects`,
        masters: `${baseUrl}/masters`,
        builders: `${baseUrl}/builders`,
        agents: `${baseUrl}/agents`,
        files: `${baseUrl}/files`,
        docs: `${baseUrl}/docs`,
      },
      modules: {
        authentication: 'JWT-based admin authentication',
        projects: 'Real estate project management with media uploads',
        masters: 'Master data management (cities, locations, amenities, etc.)',
        builders: 'Builder profile and information management',
        agents: 'Real estate agent management',
        files: 'AWS S3 file upload and management',
      },
      features: [
        'JWT Authentication with Role-based Access Control',
        'Real Estate Project Management',
        'Master Data Management for Form Fields',
        'Builder and Agent Profile Management',
        'AWS S3 File Upload with Multiple File Types',
        'Advanced Search and Filtering',
        'Pagination and Statistics',
        'MongoDB Database Integration',
        'Comprehensive Swagger API Documentation',
        'Input Validation and Error Handling',
        'CORS Support',
        'Environment Configuration',
      ],
    };
  }
}
