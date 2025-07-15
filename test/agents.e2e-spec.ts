import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './helpers/test-helper';

describe('Agents (e2e)', () => {
  let app: INestApplication;
  let authHeaders: { Authorization: string };
  let createdAgentId: string;

  beforeAll(async () => {
    app = await TestHelper.initializeApp();
    authHeaders = await TestHelper.getAuthHeaders();
  });

  afterAll(async () => {
    await TestHelper.cleanupTestData();
    await TestHelper.closeApp();
  });

  describe('POST /agents', () => {
    it('should create a new agent successfully', async () => {
      const agentData = TestHelper.createTestAgent();

      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData)
        .expect(201);

      TestHelper.expectSuccessResponse(response, 'Agent created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe(agentData.firstName);
      expect(response.body.data.lastName).toBe(agentData.lastName);
      expect(response.body.data.email).toBe(agentData.email);
      expect(response.body.data.phone).toBe(agentData.phone);
      expect(response.body.data.licenseNumber).toBe(agentData.licenseNumber);
      expect(response.body.data.experience).toBe(agentData.experience);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');

      createdAgentId = response.body.data.id;
    });

    it('should fail to create agent without authentication', async () => {
      const agentData = TestHelper.createTestAgent();

      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .send(agentData)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail to create agent with missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send({
          lastName: 'Agent',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create agent with invalid email format', async () => {
      const agentData = {
        ...TestHelper.createTestAgent(),
        email: 'invalid-email-format',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create agent with invalid phone format', async () => {
      const agentData = {
        ...TestHelper.createTestAgent(),
        phone: 'invalid-phone',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to create agent with negative experience', async () => {
      const agentData = {
        ...TestHelper.createTestAgent(),
        experience: -1,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should create agent with minimal required data', async () => {
      const minimalAgentData = {
        firstName: 'Minimal',
        lastName: 'Agent',
        email: `minimal${Date.now()}@agent.com`,
        phone: '+91-9876543210',
        licenseNumber: `MIN${Date.now()}`,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(minimalAgentData)
        .expect(201);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.firstName).toBe(minimalAgentData.firstName);
      expect(response.body.data.lastName).toBe(minimalAgentData.lastName);
      expect(response.body.data.email).toBe(minimalAgentData.email);
    });

    it('should fail to create agent with duplicate email', async () => {
      const email = `duplicate${Date.now()}@agent.com`;
      const agentData1 = {
        ...TestHelper.createTestAgent(),
        email,
      };
      const agentData2 = {
        ...TestHelper.createTestAgent(),
        email,
      };

      // Create first agent
      await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData1)
        .expect(201);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData2)
        .expect(409);

      TestHelper.expectErrorResponse(response, 409, 'already exists');
    });

    it('should fail to create agent with duplicate license number', async () => {
      const licenseNumber = `LIC${Date.now()}`;
      const agentData1 = {
        ...TestHelper.createTestAgent(),
        licenseNumber,
      };
      const agentData2 = {
        ...TestHelper.createTestAgent(),
        licenseNumber,
      };

      // Create first agent
      await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData1)
        .expect(201);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData2)
        .expect(409);

      TestHelper.expectErrorResponse(response, 409, 'already exists');
    });
  });

  describe('GET /agents', () => {
    beforeAll(async () => {
      // Create some test agents for listing tests
      const agents = Array(5).fill(null).map(() => TestHelper.createTestAgent());
      for (const agent of agents) {
        await request(app.getHttpServer())
          .post('/api/v1/agents')
          .set(authHeaders)
          .send(agent);
      }
    });

    it('should get all agents successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/agents')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('agents');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.agents)).toBe(true);
      expect(response.body.data.agents.length).toBeGreaterThan(0);
    });

    it('should get agents with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/agents?page=1&limit=3')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.agents.length).toBeLessThanOrEqual(3);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 3);
    });

    it('should search agents by name', async () => {
      const searchTerm = 'Test';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/agents?search=${searchTerm}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.agents.forEach((agent: any) => {
        const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase();
        expect(fullName).toContain(searchTerm.toLowerCase());
      });
    });

    it('should filter agents by experience range', async () => {
      const minExperience = 3;
      const maxExperience = 10;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/agents?minExperience=${minExperience}&maxExperience=${maxExperience}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      response.body.data.agents.forEach((agent: any) => {
        if (agent.experience !== undefined) {
          expect(agent.experience).toBeGreaterThanOrEqual(minExperience);
          expect(agent.experience).toBeLessThanOrEqual(maxExperience);
        }
      });
    });

    it('should sort agents by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/agents?sortBy=firstName&sortOrder=asc')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      const agents = response.body.data.agents;
      for (let i = 1; i < agents.length; i++) {
        expect(agents[i].firstName >= agents[i - 1].firstName).toBe(true);
      }
    });

    it('should sort agents by experience', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/agents?sortBy=experience&sortOrder=desc')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      const agents = response.body.data.agents.filter((a: any) => a.experience !== undefined);
      for (let i = 1; i < agents.length; i++) {
        expect(agents[i].experience <= agents[i - 1].experience).toBe(true);
      }
    });

    it('should fail to get agents without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/agents')
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('GET /agents/:id', () => {
    it('should get agent by ID successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/agents/${createdAgentId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('id', createdAgentId);
      expect(response.body.data).toHaveProperty('firstName');
      expect(response.body.data).toHaveProperty('lastName');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('licenseNumber');
    });

    it('should fail to get agent with invalid ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/agents/invalid-id')
        .set(authHeaders)
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail to get non-existent agent', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/agents/${nonExistentId}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });
  });

  describe('PATCH /agents/:id', () => {
    it('should update agent successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Agent',
        experience: 10,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/agents/${createdAgentId}`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      TestHelper.expectSuccessResponse(response, 'Agent updated successfully');
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.experience).toBe(updateData.experience);
    });

    it('should fail to update agent with invalid data', async () => {
      const updateData = {
        email: 'invalid-email-format',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/agents/${createdAgentId}`)
        .set(authHeaders)
        .send(updateData)
        .expect(400);

      TestHelper.expectValidationError(response);
    });
  });

  describe('DELETE /agents/:id', () => {
    let agentToDeleteId: string;

    beforeEach(async () => {
      // Create an agent to delete
      const agentData = TestHelper.createTestAgent();
      const response = await request(app.getHttpServer())
        .post('/api/v1/agents')
        .set(authHeaders)
        .send(agentData);
      agentToDeleteId = response.body.data.id;
    });

    it('should delete agent successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/agents/${agentToDeleteId}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response, 'Agent deleted successfully');

      // Verify agent is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/agents/${agentToDeleteId}`)
        .set(authHeaders)
        .expect(404);
    });
  });
});
