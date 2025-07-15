import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './helpers/test-helper';

describe('Projects (e2e)', () => {
  let app: INestApplication;
  let authHeaders: { Authorization: string };
  let testCityId: string;
  let testLocationId: string;
  let testBuilderId: string;
  let createdProjectId: string;

  beforeAll(async () => {
    app = await TestHelper.initializeApp();
    authHeaders = await TestHelper.getAuthHeaders();

    // Create test dependencies
    await setupTestDependencies();
  });

  afterAll(async () => {
    await TestHelper.cleanupTestData();
    await TestHelper.closeApp();
  });

  async function setupTestDependencies() {
    // Create test city
    const cityResponse = await request(app.getHttpServer())
      .post('/api/v1/masters/cities')
      .set(authHeaders)
      .send(TestHelper.createTestCity());
    testCityId = cityResponse.body.data.id;

    // Create test location
    const locationResponse = await request(app.getHttpServer())
      .post('/api/v1/masters/locations')
      .set(authHeaders)
      .send(TestHelper.createTestLocation(testCityId));
    testLocationId = locationResponse.body.data.id;

    // Create test builder
    const builderResponse = await request(app.getHttpServer())
      .post('/api/v1/builders')
      .set(authHeaders)
      .send(TestHelper.createTestBuilder());
    testBuilderId = builderResponse.body.data.id;
  }

  describe('POST /projects', () => {
    it('should create a new project successfully', async () => {
      const projectData = TestHelper.createTestProject(testCityId, testLocationId, testBuilderId);

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send(projectData)
        .expect(201);

      TestHelper.expectSuccessResponse(response, 'Project created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.projectName).toBe(projectData.projectName);
      expect(response.body.data.projectDescription).toBe(projectData.projectDescription);
      expect(response.body.data.projectStatus).toBe(projectData.projectStatus);
      expect(response.body.data.propertyType).toBe(projectData.propertyType);
      expect(response.body.data.reraNumber).toBe(projectData.reraNumber);
      expect(response.body.data.location.cityId).toBe(projectData.location.cityId);
      expect(response.body.data.location.locationId).toBe(projectData.location.locationId);
      expect(response.body.data.isActive).toBe(true);

      createdProjectId = response.body.data.id;
    });

    it('should fail to create project without authentication', async () => {
      const projectData = TestHelper.createTestProject(testCityId, testLocationId, testBuilderId);

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .send(projectData)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail to create project with missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send({
          projectDescription: 'Test description',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create project with invalid city ID', async () => {
      const projectData = {
        ...TestHelper.createTestProject(testCityId, testLocationId, testBuilderId),
        location: {
          ...TestHelper.createTestProject(testCityId, testLocationId, testBuilderId).location,
          cityId: 'invalid-city-id',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send(projectData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create project with invalid price range', async () => {
      const projectData = {
        ...TestHelper.createTestProject(testCityId, testLocationId, testBuilderId),
        priceMin: 10000000,
        priceMax: 5000000, // Max less than min
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send(projectData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should create project with minimal required data', async () => {
      const minimalProjectData = {
        projectName: `Minimal Project ${Date.now()}`,
        projectDescription: 'Minimal test project',
        projectStatus: 'PLANNING',
        location: {
          address: '123 Test Street',
          cityId: testCityId,
          locationId: testLocationId,
          state: 'Test State',
          country: 'India',
          pincode: '123456',
          coordinates: [77.1025, 28.7041],
        },
        propertyType: 'RESIDENTIAL',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send(minimalProjectData)
        .expect(201);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.projectName).toBe(minimalProjectData.projectName);
    });

    it('should fail to create project with duplicate RERA number', async () => {
      const reraNumber = `RERA${Date.now()}`;
      const projectData1 = {
        ...TestHelper.createTestProject(testCityId, testLocationId, testBuilderId),
        reraNumber,
      };
      const projectData2 = {
        ...TestHelper.createTestProject(testCityId, testLocationId, testBuilderId),
        reraNumber,
      };

      // Create first project
      await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send(projectData1)
        .expect(201);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(authHeaders)
        .send(projectData2)
        .expect(409);

      TestHelper.expectErrorResponse(response, 409, 'RERA number already exists');
    });
  });

  describe('GET /projects', () => {
    beforeAll(async () => {
      // Create some test projects for listing tests
      const projects = Array(5).fill(null).map(() => 
        TestHelper.createTestProject(testCityId, testLocationId, testBuilderId)
      );
      for (const project of projects) {
        await request(app.getHttpServer())
          .post('/api/v1/projects')
          .set(authHeaders)
          .send(project);
      }
    });

    it('should get all projects successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('projects');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.projects)).toBe(true);
      expect(response.body.data.projects.length).toBeGreaterThan(0);
    });

    it('should get projects with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects?page=1&limit=3')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.projects.length).toBeLessThanOrEqual(3);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 3);
    });

    it('should search projects by name', async () => {
      const searchTerm = 'Test';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects?search=${searchTerm}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.projects.forEach((project: any) => {
        expect(project.projectName.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    it('should filter projects by status', async () => {
      const status = 'UNDER_CONSTRUCTION';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects?projectStatus=${status}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.projects.forEach((project: any) => {
        expect(project.projectStatus).toBe(status);
      });
    });

    it('should filter projects by property type', async () => {
      const propertyType = 'RESIDENTIAL';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects?propertyType=${propertyType}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.projects.forEach((project: any) => {
        expect(project.propertyType).toBe(propertyType);
      });
    });

    it('should filter projects by city', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects?cityId=${testCityId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.projects.forEach((project: any) => {
        expect(project.location.cityId).toBe(testCityId);
      });
    });

    it('should filter projects by price range', async () => {
      const minPrice = 5000000;
      const maxPrice = 10000000;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects?priceMin=${minPrice}&priceMax=${maxPrice}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.projects.forEach((project: any) => {
        if (project.priceMin && project.priceMax) {
          expect(project.priceMin).toBeGreaterThanOrEqual(minPrice);
          expect(project.priceMax).toBeLessThanOrEqual(maxPrice);
        }
      });
    });

    it('should get only featured projects', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects?isFeatured=true')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.projects.forEach((project: any) => {
        expect(project.isFeatured).toBe(true);
      });
    });

    it('should sort projects by price', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects?sortBy=priceMin&sortOrder=asc')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      const projects = response.body.data.projects.filter((p: any) => p.priceMin);
      for (let i = 1; i < projects.length; i++) {
        expect(projects[i].priceMin >= projects[i - 1].priceMin).toBe(true);
      }
    });

    it('should fail to get projects without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get project by ID successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${createdProjectId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('id', createdProjectId);
      expect(response.body.data).toHaveProperty('projectName');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data).toHaveProperty('builder');
    });

    it('should fail to get project with invalid ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects/invalid-id')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to get non-existent project', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${nonExistentId}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });
  });
});
