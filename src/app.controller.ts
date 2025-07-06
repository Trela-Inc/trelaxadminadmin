import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Root application controller
 * Provides basic health check and application information endpoints
 */
@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * Returns basic application status and information
   */
  @Get()
  @ApiOperation({ 
    summary: 'Health Check', 
    description: 'Returns application health status and basic information' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
        version: { type: 'string' },
        environment: { type: 'string' }
      }
    }
  })
  getHello() {
    return this.appService.getHello();
  }

  /**
   * API information endpoint
   * Returns available API endpoints and documentation links
   */
  @Get('info')
  @ApiOperation({ 
    summary: 'API Information', 
    description: 'Returns API information and available endpoints' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string' },
        description: { type: 'string' },
        endpoints: {
          type: 'object',
          properties: {
            users: { type: 'string' },
            files: { type: 'string' },
            docs: { type: 'string' }
          }
        }
      }
    }
  })
  getInfo() {
    return this.appService.getApiInfo();
  }
}
