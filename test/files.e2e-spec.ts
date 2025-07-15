import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as path from 'path';
import * as fs from 'fs';
import { TestHelper } from './helpers/test-helper';

describe('Files (e2e)', () => {
  let app: INestApplication;
  let authHeaders: { Authorization: string };

  beforeAll(async () => {
    app = await TestHelper.initializeApp();
    authHeaders = await TestHelper.getAuthHeaders();
  });

  afterAll(async () => {
    await TestHelper.cleanupTestData();
    await TestHelper.closeApp();
  });

  describe('POST /files/upload', () => {
    it('should upload a single file successfully', async () => {
      // Create a test file
      const testFilePath = path.join(__dirname, 'test-image.jpg');
      const testFileContent = Buffer.from('fake-image-content');
      fs.writeFileSync(testFilePath, testFileContent);

      try {
        const response = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .set(authHeaders)
          .attach('file', testFilePath)
          .field('folder', 'test')
          .expect(201);

        TestHelper.expectSuccessResponse(response, 'File uploaded successfully');
        expect(response.body.data).toHaveProperty('url');
        expect(response.body.data).toHaveProperty('key');
        expect(response.body.data).toHaveProperty('size');
        expect(response.body.data).toHaveProperty('mimetype');
        expect(response.body.data.url).toContain('test-image.jpg');
      } finally {
        // Clean up test file
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it('should upload multiple files successfully', async () => {
      // Create test files
      const testFile1Path = path.join(__dirname, 'test-image-1.jpg');
      const testFile2Path = path.join(__dirname, 'test-image-2.jpg');
      const testFileContent = Buffer.from('fake-image-content');
      
      fs.writeFileSync(testFile1Path, testFileContent);
      fs.writeFileSync(testFile2Path, testFileContent);

      try {
        const response = await request(app.getHttpServer())
          .post('/api/v1/files/upload-multiple')
          .set(authHeaders)
          .attach('files', testFile1Path)
          .attach('files', testFile2Path)
          .field('folder', 'test')
          .expect(201);

        TestHelper.expectSuccessResponse(response, 'Files uploaded successfully');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);
        
        response.body.data.forEach((file: any) => {
          expect(file).toHaveProperty('url');
          expect(file).toHaveProperty('key');
          expect(file).toHaveProperty('size');
          expect(file).toHaveProperty('mimetype');
        });
      } finally {
        // Clean up test files
        [testFile1Path, testFile2Path].forEach(filePath => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    });

    it('should fail to upload file without authentication', async () => {
      const testFilePath = path.join(__dirname, 'test-image.jpg');
      const testFileContent = Buffer.from('fake-image-content');
      fs.writeFileSync(testFilePath, testFileContent);

      try {
        const response = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .attach('file', testFilePath)
          .field('folder', 'test')
          .expect(401);

        TestHelper.expectUnauthorizedError(response);
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it('should fail to upload file with invalid file type', async () => {
      const testFilePath = path.join(__dirname, 'test-script.exe');
      const testFileContent = Buffer.from('fake-executable-content');
      fs.writeFileSync(testFilePath, testFileContent);

      try {
        const response = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .set(authHeaders)
          .attach('file', testFilePath)
          .field('folder', 'test')
          .expect(400);

        TestHelper.expectValidationError(response);
        expect(response.body.message).toContain('file type');
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it('should fail to upload file that is too large', async () => {
      const testFilePath = path.join(__dirname, 'large-file.jpg');
      // Create a file larger than the allowed limit (assuming 10MB limit)
      const largeContent = Buffer.alloc(11 * 1024 * 1024, 'a'); // 11MB
      fs.writeFileSync(testFilePath, largeContent);

      try {
        const response = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .set(authHeaders)
          .attach('file', testFilePath)
          .field('folder', 'test')
          .expect(413);

        expect(response.body.message).toContain('file size');
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it('should fail to upload without file', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/files/upload')
        .set(authHeaders)
        .field('folder', 'test')
        .expect(400);

      TestHelper.expectValidationError(response);
      expect(response.body.message).toContain('file');
    });

    it('should upload file to specific folder', async () => {
      const testFilePath = path.join(__dirname, 'test-document.pdf');
      const testFileContent = Buffer.from('fake-pdf-content');
      fs.writeFileSync(testFilePath, testFileContent);

      try {
        const response = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .set(authHeaders)
          .attach('file', testFilePath)
          .field('folder', 'documents/legal')
          .expect(201);

        TestHelper.expectSuccessResponse(response);
        expect(response.body.data.key).toContain('documents/legal');
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });
  });

  describe('GET /files/:key', () => {
    let uploadedFileKey: string;

    beforeAll(async () => {
      // Upload a file for testing retrieval
      const testFilePath = path.join(__dirname, 'test-retrieve.jpg');
      const testFileContent = Buffer.from('fake-image-for-retrieval');
      fs.writeFileSync(testFilePath, testFileContent);

      try {
        const uploadResponse = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .set(authHeaders)
          .attach('file', testFilePath)
          .field('folder', 'test');

        uploadedFileKey = uploadResponse.body.data.key;
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it('should get file metadata successfully', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/files/${encodeURIComponent(uploadedFileKey)}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data).toHaveProperty('key', uploadedFileKey);
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('size');
      expect(response.body.data).toHaveProperty('mimetype');
      expect(response.body.data).toHaveProperty('lastModified');
    });

    it('should fail to get non-existent file', async () => {
      const nonExistentKey = 'test/non-existent-file.jpg';
      
      const response = await request(app.getHttpServer())
        .get(`/api/v1/files/${encodeURIComponent(nonExistentKey)}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });

    it('should fail to get file without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/files/${encodeURIComponent(uploadedFileKey)}`)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('DELETE /files/:key', () => {
    let fileToDeleteKey: string;

    beforeEach(async () => {
      // Upload a file to delete
      const testFilePath = path.join(__dirname, 'test-delete.jpg');
      const testFileContent = Buffer.from('fake-image-to-delete');
      fs.writeFileSync(testFilePath, testFileContent);

      try {
        const uploadResponse = await request(app.getHttpServer())
          .post('/api/v1/files/upload')
          .set(authHeaders)
          .attach('file', testFilePath)
          .field('folder', 'test');

        fileToDeleteKey = uploadResponse.body.data.key;
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it('should delete file successfully', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/files/${encodeURIComponent(fileToDeleteKey)}`)
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response, 'File deleted successfully');

      // Verify file is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/files/${encodeURIComponent(fileToDeleteKey)}`)
        .set(authHeaders)
        .expect(404);
    });

    it('should fail to delete non-existent file', async () => {
      const nonExistentKey = 'test/non-existent-file.jpg';
      
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/files/${encodeURIComponent(nonExistentKey)}`)
        .set(authHeaders)
        .expect(404);

      TestHelper.expectNotFoundError(response);
    });

    it('should fail to delete file without authentication', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/files/${encodeURIComponent(fileToDeleteKey)}`)
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });

  describe('GET /files/list', () => {
    beforeAll(async () => {
      // Upload some test files for listing
      const testFiles = ['list-test-1.jpg', 'list-test-2.pdf', 'list-test-3.png'];
      
      for (const fileName of testFiles) {
        const testFilePath = path.join(__dirname, fileName);
        const testFileContent = Buffer.from(`fake-content-for-${fileName}`);
        fs.writeFileSync(testFilePath, testFileContent);

        try {
          await request(app.getHttpServer())
            .post('/api/v1/files/upload')
            .set(authHeaders)
            .attach('file', testFilePath)
            .field('folder', 'test-list');
        } finally {
          if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
          }
        }
      }
    });

    it('should list files successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/files/list?folder=test-list')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(Array.isArray(response.body.data.files)).toBe(true);
      expect(response.body.data.files.length).toBeGreaterThan(0);
      
      response.body.data.files.forEach((file: any) => {
        expect(file).toHaveProperty('key');
        expect(file).toHaveProperty('url');
        expect(file).toHaveProperty('size');
        expect(file).toHaveProperty('lastModified');
      });
    });

    it('should list files with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/files/list?folder=test-list&limit=2')
        .set(authHeaders)
        .expect(200);

      TestHelper.expectSuccessResponse(response);
      expect(response.body.data.files.length).toBeLessThanOrEqual(2);
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should fail to list files without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/files/list')
        .expect(401);

      TestHelper.expectUnauthorizedError(response);
    });
  });
});
