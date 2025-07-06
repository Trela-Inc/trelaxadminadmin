import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

/**
 * Bootstrap function to initialize and start the NestJS application
 * Configures global pipes, Swagger documentation, and server settings
 */
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // Get configuration service for environment variables
  const configService = app.get(ConfigService);
  
  // Set global API prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);
  
  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );
  
  // Register global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Swagger API documentation configuration
  const config = new DocumentBuilder()
    .setTitle('🏢 TrelaX Core Admin Backend API')
    .setDescription(`
# 🚀 Complete Real Estate Management Backend

## 📋 Overview
This API provides comprehensive backend services for real estate management including:
- **Admin Authentication** - Secure JWT-based authentication for admin users
- **Project Management** - Complete CRUD operations for real estate projects
- **Master Data Management** - Centralized management of form dropdown fields
- **File Management** - AWS S3 integration for media and document uploads

## 🔐 Authentication
All endpoints (except login) require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## 🎯 Default Admin Credentials
- **Email**: admin@trelax.com
- **Email**: superadmin@trelax.com
- **Email**: manager@trelax.com
- **Password**: admin123 (for all accounts)

## 📊 Response Format
All responses follow a standard format:
\`\`\`json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## 🚀 Quick Start
1. Login with admin credentials to get JWT token
2. Use the token in Authorization header for all other requests
3. Explore the interactive API documentation below
    `)
    .setVersion('1.0.0')
    .setContact('TrelaX Support', 'https://trelax.com', 'support@trelax.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.trelax.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from /auth/login endpoint',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('🔐 Authentication', 'Admin authentication and profile management')
    .addTag('🏢 Projects', 'Real estate project CRUD operations, media uploads, and search')
    .addTag('🎛️ Masters', 'Master data management for form dropdowns (cities, amenities, etc.)')
    .addTag('📁 Files', 'File upload, download, and management with AWS S3 integration')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    customSiteTitle: 'TrelaX API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
      requestInterceptor: (req: any) => {
        req.headers['X-API-Version'] = '1.0';
        return req;
      },
    },
    explorer: true,
  });
  
  // Get port from environment or default to 3000
  const port = configService.get<number>('PORT', 3000);
  
  // Start the server
  await app.listen(port);

  // Enhanced startup messages
  console.log('\n🎉 ===============================================');
  console.log('🚀 TrelaX Core Admin Backend Server Started!');
  console.log('===============================================');
  console.log(`🌐 Server running at: http://localhost:${port}`);
  console.log(`📡 API Base URL: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/${apiPrefix}/docs`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Port: ${port}`);
  console.log('===============================================');

  // Display all available routes
  console.log('\n📋 AVAILABLE API ROUTES:');
  console.log('===============================================');

  console.log('\n🔐 AUTHENTICATION ROUTES:');
  console.log(`POST   /${apiPrefix}/auth/login`);
  console.log(`GET    /${apiPrefix}/auth/profile`);
  console.log(`POST   /${apiPrefix}/auth/refresh`);

  console.log('\n🏢 PROJECTS ROUTES:');
  console.log(`POST   /${apiPrefix}/projects`);
  console.log(`GET    /${apiPrefix}/projects`);
  console.log(`GET    /${apiPrefix}/projects/:id`);
  console.log(`PATCH  /${apiPrefix}/projects/:id`);
  console.log(`DELETE /${apiPrefix}/projects/:id`);
  console.log(`POST   /${apiPrefix}/projects/:id/media`);
  console.log(`DELETE /${apiPrefix}/projects/:id/media/:mediaId`);
  console.log(`POST   /${apiPrefix}/projects/:id/documents`);
  console.log(`DELETE /${apiPrefix}/projects/:id/documents/:documentId`);
  console.log(`GET    /${apiPrefix}/projects/search/location`);
  console.log(`GET    /${apiPrefix}/projects/featured`);
  console.log(`GET    /${apiPrefix}/projects/statistics`);

  console.log('\n🎛️ MASTERS ROUTES:');
  console.log(`POST   /${apiPrefix}/masters`);
  console.log(`GET    /${apiPrefix}/masters`);
  console.log(`GET    /${apiPrefix}/masters/:id`);
  console.log(`PATCH  /${apiPrefix}/masters/:id`);
  console.log(`DELETE /${apiPrefix}/masters/:id`);
  console.log(`GET    /${apiPrefix}/masters/cities`);
  console.log(`GET    /${apiPrefix}/masters/locations/:cityId`);
  console.log(`GET    /${apiPrefix}/masters/amenities`);
  console.log(`GET    /${apiPrefix}/masters/bedrooms`);
  console.log(`GET    /${apiPrefix}/masters/bathrooms`);
  console.log(`GET    /${apiPrefix}/masters/statistics`);

  console.log('\n📁 FILES ROUTES:');
  console.log(`POST   /${apiPrefix}/files/upload`);
  console.log(`GET    /${apiPrefix}/files/:id`);
  console.log(`DELETE /${apiPrefix}/files/:id`);
  console.log(`GET    /${apiPrefix}/files/:id/download`);
  console.log(`GET    /${apiPrefix}/files/user/:userId`);

  console.log('\n===============================================');
  console.log('🔑 DEFAULT ADMIN CREDENTIALS:');
  console.log('===============================================');
  console.log('Email: admin@trelax.com');
  console.log('Email: superadmin@trelax.com');
  console.log('Email: manager@trelax.com');
  console.log('Password: admin123 (for all accounts)');
  console.log('===============================================\n');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
