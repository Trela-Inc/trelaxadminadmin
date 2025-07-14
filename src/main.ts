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
This comprehensive API provides complete backend services for real estate management including:

### 🔐 **Authentication Module**
- **JWT-based Authentication** - Secure admin authentication system
- **Role-based Access Control** - Admin, Super Admin, Manager roles
- **Token Management** - Access tokens with refresh capability

### 🏢 **Projects Management**
- **Complete CRUD Operations** - Create, read, update, delete projects
- **Media Upload Integration** - Images, videos, floor plans, brochures
- **Document Management** - RERA certificates, approvals, legal documents
- **Advanced Filtering** - Search by location, price, amenities, status
- **Statistics & Analytics** - Project performance metrics

### 🎛️ **Master Data Management**
- **Cities Management** - Hierarchical city and state data
- **Locations Management** - Area-wise location mapping
- **Amenities Management** - Categorized amenity options
- **Property Configuration** - Floors, towers, rooms, washrooms
- **Property Types** - Residential, commercial classifications
- **Document Templates** - Standardized document types

### 🏗️ **Builders & Agents**
- **Builder Profiles** - Complete builder information management
- **Agent Management** - Real estate agent data and profiles
- **Contact Management** - Centralized contact information

### 📁 **File Management**
- **AWS S3 Integration** - Secure cloud file storage
- **Multiple File Types** - Images, documents, videos support
- **File Organization** - Categorized file management
- **Download & Streaming** - Optimized file delivery

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
  "pagination": { "page": 1, "limit": 10, "total": 100 }, // For paginated responses
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## 🎯 Key Features
- **📱 RESTful API Design** - Standard HTTP methods and status codes
- **🔍 Advanced Search & Filtering** - Comprehensive query capabilities
- **📄 Pagination Support** - Efficient data loading for large datasets
- **📊 Real-time Statistics** - Analytics and reporting endpoints
- **🔒 Secure File Upload** - AWS S3 integration with validation
- **📝 Comprehensive Validation** - Input validation and error handling
- **🚀 High Performance** - Optimized database queries and caching

## 🚀 Quick Start
1. **Login** with admin credentials to get JWT token
2. **Authorize** using the token in the Authorization header
3. **Explore** the interactive API documentation below
4. **Test** endpoints directly from this interface
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
  console.log(`POST   /${apiPrefix}/projects/:id/media/:type`);
  console.log(`POST   /${apiPrefix}/projects/:id/documents/:type`);
  console.log(`GET    /${apiPrefix}/projects/admin/statistics`);
  console.log(`GET    /${apiPrefix}/projects/featured`);

  console.log('\n🎛️ MASTERS ROUTES:');
  console.log('\n   🏙️ Cities:');
  console.log(`   POST   /${apiPrefix}/masters/cities`);
  console.log(`   GET    /${apiPrefix}/masters/cities`);
  console.log(`   GET    /${apiPrefix}/masters/cities/:id`);
  console.log(`   PATCH  /${apiPrefix}/masters/cities/:id`);
  console.log(`   DELETE /${apiPrefix}/masters/cities/:id`);
  console.log(`   GET    /${apiPrefix}/masters/cities/statistics`);
  console.log(`   GET    /${apiPrefix}/masters/cities/popular`);

  console.log('\n   📍 Locations:');
  console.log(`   POST   /${apiPrefix}/masters/locations`);
  console.log(`   GET    /${apiPrefix}/masters/locations`);
  console.log(`   GET    /${apiPrefix}/masters/locations/:id`);
  console.log(`   PATCH  /${apiPrefix}/masters/locations/:id`);
  console.log(`   DELETE /${apiPrefix}/masters/locations/:id`);
  console.log(`   GET    /${apiPrefix}/masters/locations/by-city/:cityId`);

  console.log('\n   🏊 Amenities:');
  console.log(`   POST   /${apiPrefix}/masters/amenities`);
  console.log(`   GET    /${apiPrefix}/masters/amenities`);
  console.log(`   GET    /${apiPrefix}/masters/amenities/:id`);
  console.log(`   PATCH  /${apiPrefix}/masters/amenities/:id`);
  console.log(`   DELETE /${apiPrefix}/masters/amenities/:id`);
  console.log(`   GET    /${apiPrefix}/masters/amenities/category/:category`);

  console.log('\n   🏢 Property Configuration:');
  console.log(`   GET    /${apiPrefix}/masters/floors`);
  console.log(`   GET    /${apiPrefix}/masters/towers`);
  console.log(`   GET    /${apiPrefix}/masters/property-types`);
  console.log(`   GET    /${apiPrefix}/masters/rooms`);
  console.log(`   GET    /${apiPrefix}/masters/washrooms`);

  console.log('\n🏗️ BUILDERS ROUTES:');
  console.log(`POST   /${apiPrefix}/builders`);
  console.log(`GET    /${apiPrefix}/builders`);
  console.log(`GET    /${apiPrefix}/builders/:id`);
  console.log(`PATCH  /${apiPrefix}/builders/:id`);
  console.log(`DELETE /${apiPrefix}/builders/:id`);

  console.log('\n👥 AGENTS ROUTES:');
  console.log(`POST   /${apiPrefix}/agents`);
  console.log(`GET    /${apiPrefix}/agents`);
  console.log(`GET    /${apiPrefix}/agents/:id`);
  console.log(`PATCH  /${apiPrefix}/agents/:id`);
  console.log(`DELETE /${apiPrefix}/agents/:id`);

  console.log('\n📁 FILES ROUTES:');
  console.log(`POST   /${apiPrefix}/files/upload`);
  console.log(`GET    /${apiPrefix}/files/:id`);
  console.log(`DELETE /${apiPrefix}/files/:id`);
  console.log(`GET    /${apiPrefix}/files/:id/download`);

  console.log('\n📄 DOCUMENT UPLOADS:');
  console.log(`POST   /${apiPrefix}/masters/uploads`);
  console.log(`POST   /${apiPrefix}/masters/uploads/multiple`);
  console.log(`GET    /${apiPrefix}/masters/uploads`);
  console.log(`GET    /${apiPrefix}/masters/uploads/:id`);
  console.log(`DELETE /${apiPrefix}/masters/uploads/:id`);

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
