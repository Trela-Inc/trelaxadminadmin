import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './helpers/test-helper';

describe('Builders (e2e)', () => {
  let app: INestApplication;
  let authHeaders: { Authorization: string };
  let createdBuilderId: string;

  beforeAll(async () => {
    app = await TestHelper.initializeApp();
    authHeaders = await TestHelper.getAuthHeaders();
  });

  afterAll(async () => {
    await TestHelper.cleanupTestData();
    await TestHelper.closeApp();
  });

  describe('POST /builders', () => {
    it('should create a new builder successfully', async () => {
      const builderData = TestHelper.createTestBuilder();

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData)
        .expect(201);

      TestHelper.expectSuccessResponse(response, 'Builder created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(builderData.name);
      expect(response.body.data.description).toBe(builderData.description);
      expect(response.body.data.website).toBe(builderData.website);
      expect(response.body.data.contactEmail).toBe(builderData.contactEmail);
      expect(response.body.data.contactPhone).toBe(builderData.contactPhone);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');

      createdBuilderId = response.body.data.id;
    });

    it('should fail to create builder without authentication', async () => {
      const builderData = TestHelper.createTestBuilder();

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .send(builderData)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail to create builder with missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send({
          description: 'Test description',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create builder with invalid email format', async () => {
      const builderData = {
        ...TestHelper.createTestBuilder(),
        contactEmail: 'invalid-email-format',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create builder with invalid phone format', async () => {
      const builderData = {
        ...TestHelper.createTestBuilder(),
        contactPhone: 'invalid-phone',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create builder with invalid website URL', async () => {
      const builderData = {
        ...TestHelper.createTestBuilder(),
        website: 'not-a-valid-url',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should create builder with minimal required data', async () => {
      const minimalBuilderData = {
        name: `Minimal Builder ${Date.now()}`,
        contactEmail: `minimal${Date.now()}@builder.com`,
        contactPhone: '+91-9876543210',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(minimalBuilderData)
        .expect(201);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.name).toBe(minimalBuilderData.name);
      expect(response.body.data.contactEmail).toBe(minimalBuilderData.contactEmail);
      expect(response.body.data.contactPhone).toBe(minimalBuilderData.contactPhone);
    });

    it('should fail to create builder with duplicate email', async () => {
      const email = `duplicate${Date.now()}@builder.com`;
      const builderData1 = {
        ...TestHelper.createTestBuilder(),
        contactEmail: email,
      };
      const builderData2 = {
        ...TestHelper.createTestBuilder(),
        contactEmail: email,
      };

      // Create first builder
      await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData1)
        .expect(201);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData2)
        .expect(409);

      TestHelper.expectErrorResponse(response, 409, 'already exists');
    });

    it('should handle special characters in builder name', async () => {
      const builderData = {
        ...TestHelper.createTestBuilder(),
        name: 'Builder & Associates Pvt. Ltd.',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData)
        .expect(201);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.name).toBe(builderData.name);
    });
  });

  describe('GET /builders', () => {
    beforeAll(async () => {
      // Create some test builders for listing tests
      const builders = Array(5).fill(null).map(() => TestHelper.createTestBuilder());
      for (const builder of builders) {
        await request(app.getHttpServer())
          .post('/api/v1/builders')
          .set(authHeaders)
          .send(builder);
      }
    });

    it('should get all builders successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('builders');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.builders)).toBe(true);
      expect(response.body.data.builders.length).toBeGreaterThan(0);
    });

    it('should get builders with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders?page=1&limit=3')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.builders.length).toBeLessThanOrEqual(3);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 3);
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('totalPages');
    });

    it('should search builders by name', async () => {
      const searchTerm = 'Test';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/builders?search=${searchTerm}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.builders.forEach((builder: any) => {
        expect(builder.name.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    it('should sort builders by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders?sortBy=name&sortOrder=asc')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      const builders = response.body.data.builders;
      for (let i = 1; i < builders.length; i++) {
        expect(builders[i].name >= builders[i - 1].name).toBe(true);
      }
    });

    it('should sort builders by creation date', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders?sortBy=createdAt&sortOrder=desc')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      const builders = response.body.data.builders;
      for (let i = 1; i < builders.length; i++) {
        const current = new Date(builders[i].createdAt);
        const previous = new Date(builders[i - 1].createdAt);
        expect(current <= previous).toBe(true);
      }
    });

    it('should fail to get builders without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders')
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should handle invalid pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders?page=-1&limit=0')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should handle invalid sort parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders?sortBy=invalidField&sortOrder=invalid')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });
  });

  describe('GET /builders/:id', () => {
    it('should get builder by ID successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/builders/${createdBuilderId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('id', createdBuilderId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('contactEmail');
      expect(response.body.data).toHaveProperty('contactPhone');
    });

    it('should fail to get builder with invalid ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/builders/invalid-id')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to get non-existent builder', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/builders/${nonExistentId}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });

    it('should fail to get builder without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/builders/${createdBuilderId}`)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('PATCH /builders/:id', () => {
    it('should update builder successfully', async () => {
      const updateData = {
        name: 'Updated Builder Name',
        description: 'Updated description',
        website: 'https://updated-website.com',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/builders/${createdBuilderId}`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      TestHelper.expectSuccessResponse(response, 'Builder updated successfully');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.website).toBe(updateData.website);
      expect(response.body.data.id).toBe(createdBuilderId);
    });

    it('should fail to update builder with invalid data', async () => {
      const updateData = {
        contactEmail: 'invalid-email-format',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/builders/${createdBuilderId}`)
        .set(authHeaders)
        .send(updateData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to update non-existent builder', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/builders/${nonExistentId}`)
        .set(authHeaders)
        .send(updateData)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });

    it('should fail to update builder without authentication', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/builders/${createdBuilderId}`)
        .send(updateData)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('DELETE /builders/:id', () => {
    let builderToDeleteId: string;

    beforeEach(async () => {
      // Create a builder to delete
      const builderData = TestHelper.createTestBuilder();
      const response = await request(app.getHttpServer())
        .post('/api/v1/builders')
        .set(authHeaders)
        .send(builderData);
      builderToDeleteId = response.body.data.id;
    });

    it('should delete builder successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/builders/${builderToDeleteId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response, 'Builder deleted successfully');

      // Verify builder is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/builders/${builderToDeleteId}`)
        .set(authHeaders)
        .expect(404);
    });

    it('should fail to delete non-existent builder', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/builders/${nonExistentId}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });

    it('should fail to delete builder without authentication', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/builders/${builderToDeleteId}`)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });
});
