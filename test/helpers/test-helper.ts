import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

/**
 * Test Helper Class
 * Provides utilities for setting up and managing e2e tests
 */
export class TestHelper {
  private static app: INestApplication;
  private static moduleFixture: TestingModule;
  private static authToken: string;
  private static testUserId: string;

  /**
   * Initialize the test application
   */
  static async initializeApp(): Promise<INestApplication> {
    if (this.app) {
      return this.app;
    }

    this.moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    })
    .overrideModule(MongooseModule)
    .useModule(
      MongooseModule.forRoot(
        process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/trelax_test_db',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
    )
    .compile();

    this.app = this.moduleFixture.createNestApplication();
    
    // Apply global pipes and middleware
    this.app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Set global prefix
    this.app.setGlobalPrefix('api/v1');

    await this.app.init();
    return this.app;
  }

  /**
   * Get the test application instance
   */
  static getApp(): INestApplication {
    if (!this.app) {
      throw new Error('App not initialized. Call initializeApp() first.');
    }
    return this.app;
  }

  /**
   * Login and get authentication token
   */
  static async login(email: string = 'admin@trelax.com', password: string = 'admin123'): Promise<string> {
    if (this.authToken) {
      return this.authToken;
    }

    const response = await request(this.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    this.authToken = response.body.data.token;
    this.testUserId = response.body.data.user.id;
    
    return this.authToken;
  }

  /**
   * Get authentication headers
   */
  static async getAuthHeaders(): Promise<{ Authorization: string }> {
    const token = await this.login();
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Get test user ID
   */
  static getTestUserId(): string {
    return this.testUserId;
  }

  /**
   * Clear authentication
   */
  static clearAuth(): void {
    this.authToken = '';
    this.testUserId = '';
  }

  /**
   * Clean up test data from database
   */
  static async cleanupTestData(): Promise<void> {
    // This would typically clean up test data
    // Implementation depends on your database structure
    console.log('Cleaning up test data...');
  }

  /**
   * Close the test application
   */
  static async closeApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.app = null;
      this.moduleFixture = null;
      this.authToken = '';
      this.testUserId = '';
    }
  }

  /**
   * Create test data helpers
   */
  static createTestCity() {
    return {
      name: `Test City ${Date.now()}`,
      state: 'Test State',
      country: 'India',
      coordinates: [77.1025, 28.7041],
      isPopular: true,
    };
  }

  static createTestLocation(cityId: string) {
    return {
      name: `Test Location ${Date.now()}`,
      parentId: cityId,
      locationCode: `TST${Date.now().toString().slice(-3)}`,
      coordinates: [77.1025, 28.7041],
      locationType: 'residential',
    };
  }

  static createTestAmenity() {
    return {
      name: `Test Amenity ${Date.now()}`,
      category: 'SPORTS',
      importance: 4,
      icon: 'test-icon',
    };
  }

  static createTestBuilder() {
    return {
      name: `Test Builder ${Date.now()}`,
      description: 'A test real estate builder',
      website: 'https://testbuilder.com',
      contactEmail: 'test@builder.com',
      contactPhone: '+91-9876543210',
    };
  }

  static createTestAgent() {
    return {
      firstName: 'Test',
      lastName: 'Agent',
      email: `testagent${Date.now()}@example.com`,
      phone: '+91-9876543210',
      licenseNumber: `LIC${Date.now()}`,
      experience: 5,
    };
  }

  static createTestProject(cityId: string, locationId: string, builderId: string) {
    return {
      projectName: `Test Project ${Date.now()}`,
      projectDescription: 'A comprehensive test project',
      builder: {
        name: 'Test Builder',
        contactEmail: 'test@builder.com',
        contactPhone: '+91-9876543210',
      },
      projectStatus: 'UNDER_CONSTRUCTION',
      location: {
        address: '123 Test Street',
        cityId,
        locationId,
        state: 'Test State',
        country: 'India',
        pincode: '123456',
        coordinates: [77.1025, 28.7041],
      },
      reraNumber: `RERA${Date.now()}`,
      propertyType: 'RESIDENTIAL',
      totalUnits: 100,
      totalFloors: 10,
      totalTowers: 2,
      priceMin: 5000000,
      priceMax: 15000000,
    };
  }

  /**
   * Assertion helpers
   */
  static expectSuccessResponse(response: any, expectedMessage?: string) {
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage);
    }
  }

  static expectErrorResponse(response: any, expectedStatus: number, expectedMessage?: string) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('success', false);
    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage);
    }
  }

  static expectValidationError(response: any) {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toContain('validation');
  }

  static expectUnauthorizedError(response: any) {
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
  }

  static expectNotFoundError(response: any) {
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
  }

  /**
   * Wait helper
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
