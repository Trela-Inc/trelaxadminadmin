import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './helpers/test-helper';

describe('Masters - Cities (e2e)', () => {
  let app: INestApplication;
  let authHeaders: { Authorization: string };
  let createdCityId: string;

  beforeAll(async () => {
    app = await TestHelper.initializeApp();
    authHeaders = await TestHelper.getAuthHeaders();
  });

  afterAll(async () => {
    await TestHelper.cleanupTestData();
    await TestHelper.closeApp();
  });

  describe('POST /masters/cities', () => {
    it('should create a new city successfully', async () => {
      const cityData = TestHelper.createTestCity();

      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send(cityData)
        .expect(201);

      TestHelper.expectSuccessResponse(response, 'City created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(cityData.name);
      expect(response.body.data.state).toBe(cityData.state);
      expect(response.body.data.country).toBe(cityData.country);
      expect(response.body.data.coordinates).toEqual(cityData.coordinates);
      expect(response.body.data.isPopular).toBe(cityData.isPopular);
      expect(response.body.data.masterType).toBe('CITY');
      expect(response.body.data.status).toBe('ACTIVE');

      createdCityId = response.body.data.id;
    });

    it('should fail to create city without authentication', async () => {
      const cityData = TestHelper.createTestCity();

      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .send(cityData)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail to create city with missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send({
          state: 'Test State',
          country: 'India',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create city with invalid coordinates', async () => {
      const cityData = {
        ...TestHelper.createTestCity(),
        coordinates: [181, 91], // Invalid coordinates
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send(cityData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create city with duplicate name', async () => {
      const cityData = TestHelper.createTestCity();

      // Create first city
      await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send(cityData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send(cityData)
        .expect(409);

      TestHelper.expectErrorResponse(response, 409, 'already exists');
    });

    it('should create city with minimal required data', async () => {
      const minimalCityData = {
        name: `Minimal City ${Date.now()}`,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send(minimalCityData)
        .expect(201);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.name).toBe(minimalCityData.name);
      expect(response.body.data.country).toBe('India'); // Default value
    });

    it('should handle special characters in city name', async () => {
      const cityData = {
        ...TestHelper.createTestCity(),
        name: 'Test City with Special Chars !@#$%',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/masters/cities')
        .set(authHeaders)
        .send(cityData)
        .expect(201);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.name).toBe(cityData.name);
    });
  });

  describe('GET /masters/cities', () => {
    beforeAll(async () => {
      // Create some test cities for listing tests
      const cities = Array(5).fill(null).map(() => TestHelper.createTestCity());
      for (const city of cities) {
        await request(app.getHttpServer())
          .post('/api/v1/masters/cities')
          .set(authHeaders)
          .send(city);
      }
    });

    it('should get all cities successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('cities');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.cities)).toBe(true);
      expect(response.body.data.cities.length).toBeGreaterThan(0);
    });

    it('should get cities with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities?page=1&limit=3')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.cities.length).toBeLessThanOrEqual(3);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 3);
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('totalPages');
    });

    it('should search cities by name', async () => {
      const searchTerm = 'Test';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/masters/cities?search=${searchTerm}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.cities.forEach((city: any) => {
        expect(city.name.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    it('should filter cities by state', async () => {
      const state = 'Test State';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/masters/cities?state=${state}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.cities.forEach((city: any) => {
        expect(city.state).toBe(state);
      });
    });

    it('should filter cities by status', async () => {
      const status = 'ACTIVE';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/masters/cities?status=${status}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.cities.forEach((city: any) => {
        expect(city.status).toBe(status);
      });
    });

    it('should get only popular cities', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities?isPopular=true')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.cities.forEach((city: any) => {
        expect(city.isPopular).toBe(true);
      });
    });

    it('should sort cities by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities?sortBy=name&sortOrder=asc')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      const cities = response.body.data.cities;
      for (let i = 1; i < cities.length; i++) {
        expect(cities[i].name >= cities[i - 1].name).toBe(true);
      }
    });

    it('should fail to get cities without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities')
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should handle invalid pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities?page=-1&limit=0')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });
  });

  describe('GET /masters/cities/:id', () => {
    it('should get city by ID successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/masters/cities/${createdCityId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('id', createdCityId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('masterType', 'CITY');
    });

    it('should fail to get city with invalid ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/masters/cities/invalid-id')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to get non-existent city', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/masters/cities/${nonExistentId}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });

    it('should fail to get city without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/masters/cities/${createdCityId}`)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });
});
