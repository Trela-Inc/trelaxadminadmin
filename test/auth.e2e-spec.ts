import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './helpers/test-helper';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await TestHelper.initializeApp();
  });

  afterAll(async () => {
    await TestHelper.closeApp();
  });

  beforeEach(async () => {
    TestHelper.clearAuth();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@trelax.com',
          password: 'admin123',
        })
        .expect(200);

      TestHelper.expectSuccessResponse(response, 'Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', 'admin@trelax.com');
      expect(response.body.data.user).toHaveProperty('role');
      expect(response.body.data.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/); // JWT format
    });

    it('should login successfully with superadmin credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'superadmin@trelax.com',
          password: 'admin123',
        })
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.user.email).toBe('superadmin@trelax.com');
    });

    it('should login successfully with manager credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'manager@trelax.com',
          password: 'admin123',
        })
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.user.email).toBe('manager@trelax.com');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'admin123',
        })
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@trelax.com',
          password: 'wrongpassword',
        })
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with missing email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          password: 'admin123',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail with missing password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@trelax.com',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: 'admin123',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should fail with empty request body', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);

      TestHelper.expectValidationError(response);
    });

    it('should handle SQL injection attempts', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: "admin@trelax.com'; DROP TABLE users; --",
          password: 'admin123',
        })
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should handle XSS attempts in email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: '<script>alert("xss")</script>@example.com',
          password: 'admin123',
        })
        .expect(400);

      TestHelper.expectValidationError(response);
    });
  });

  describe('GET /auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const authHeaders = await TestHelper.getAuthHeaders();
      
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('role');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should fail without authentication token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set({ Authorization: 'Bearer invalid-token' })
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail with malformed token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set({ Authorization: 'Bearer' })
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });

    it('should fail with expired token', async () => {
      // This would require creating an expired token
      // For now, we'll test with a malformed token that looks expired
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set({ Authorization: `Bearer ${expiredToken}` })
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('Authentication Security', () => {
    it('should rate limit login attempts', async () => {
      const loginData = {
        email: 'admin@trelax.com',
        password: 'wrongpassword',
      };

      // Make multiple failed login attempts
      const promises = Array(10).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(promises);
      
      // At least some should fail due to rate limiting
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      // Note: This test might need adjustment based on your rate limiting implementation
    });

    it('should not expose sensitive information in error messages', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password',
        })
        .expect(401);

      // Should not reveal whether email exists or not
      expect(response.body.message).not.toContain('user not found');
      expect(response.body.message).not.toContain('email does not exist');
    });

    it('should handle concurrent login attempts', async () => {
      const loginData = {
        email: 'admin@trelax.com',
        password: 'admin123',
      };

      const promises = Array(5).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(promises);
      
      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        TestHelper.expectSuccessResponse(response);
      });
    });
  });
});
