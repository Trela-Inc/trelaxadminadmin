# 🧪 E2E Testing Guide

This directory contains comprehensive end-to-end (e2e) tests for the TrelaX Core Admin Backend API using Jest and Supertest.

## 📋 Test Structure

### Test Files

| Test Suite | File | Description | Dependencies |
|------------|------|-------------|--------------|
| **App** | `app.e2e-spec.ts` | Basic application health checks | None |
| **Authentication** | `auth.e2e-spec.ts` | Login, profile, security tests | None |
| **Masters - Cities** | `masters-cities.e2e-spec.ts` | Cities CRUD operations | Authentication |
| **Builders** | `builders.e2e-spec.ts` | Builders CRUD operations | Authentication |
| **Agents** | `agents.e2e-spec.ts` | Agents CRUD operations | Authentication |
| **Projects** | `projects.e2e-spec.ts` | Projects CRUD operations | Authentication, Cities, Builders |

### Helper Files

- **`helpers/test-helper.ts`** - Utility functions for test setup, authentication, and assertions
- **`setup.ts`** - Global test configuration and environment setup
- **`run-tests.ts`** - Advanced test runner with dependency management

## 🚀 Running Tests

### Prerequisites

1. **Database Setup**
   ```bash
   # Option 1: Local MongoDB
   # Install and start MongoDB locally
   
   # Option 2: Use existing MongoDB Atlas
   # Tests will use a separate test database
   ```

2. **Environment Configuration**
   ```bash
   # Copy test environment file
   cp .env.test .env.test.local
   
   # Update MONGO_URI_TEST if needed
   ```

### Basic Test Commands

```bash
# Run all e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:e2e:coverage

# Run tests in watch mode
npm run test:e2e:watch

# Run specific test file
npm run test:e2e -- --testPathPattern=auth.e2e-spec.ts

# Run tests with verbose output
npm run test:e2e -- --verbose
```

### Advanced Test Runner

```bash
# Run all tests with dependency management
npm run test:e2e:runner

# List available test suites
npm run test:e2e:list

# Run single test suite
npm run test:e2e:single auth

# Run with custom configuration
npm run test:e2e:runner -- --config custom-jest.config.js
```

## 📊 Test Coverage

### Authentication Tests (auth.e2e-spec.ts)

- ✅ **Login Endpoint**
  - Valid credentials (admin, superadmin, manager)
  - Invalid email/password
  - Missing fields
  - Invalid email format
  - Security tests (SQL injection, XSS)
  - Rate limiting
  - Concurrent requests

- ✅ **Profile Endpoint**
  - Valid token access
  - Invalid/missing token
  - Malformed token
  - Expired token

### Masters - Cities Tests (masters-cities.e2e-spec.ts)

- ✅ **Create City (POST /masters/cities)**
  - Valid city creation
  - Missing required fields
  - Invalid coordinates
  - Duplicate city names
  - Special characters handling

- ✅ **List Cities (GET /masters/cities)**
  - Pagination
  - Search by name
  - Filter by state/status
  - Sort by various fields
  - Popular cities filter

- ✅ **Get City (GET /masters/cities/:id)**
  - Valid ID retrieval
  - Invalid ID format
  - Non-existent city

### Builders Tests (builders.e2e-spec.ts)

- ✅ **Create Builder (POST /builders)**
  - Valid builder creation
  - Email/phone validation
  - Website URL validation
  - Duplicate email prevention

- ✅ **List Builders (GET /builders)**
  - Pagination and sorting
  - Search functionality
  - Invalid parameters handling

- ✅ **Update/Delete Builder**
  - Successful updates
  - Validation on updates
  - Soft/hard delete operations

### Agents Tests (agents.e2e-spec.ts)

- ✅ **Create Agent (POST /agents)**
  - Complete agent profile creation
  - License number uniqueness
  - Experience validation
  - Contact information validation

- ✅ **List Agents (GET /agents)**
  - Experience range filtering
  - Name-based search
  - Sorting by multiple fields

- ✅ **Agent Management**
  - Profile updates
  - Status changes
  - Deletion with cleanup

### Projects Tests (projects.e2e-spec.ts)

- ✅ **Create Project (POST /projects)**
  - Complete project creation
  - Location validation
  - Price range validation
  - RERA number uniqueness

- ✅ **List Projects (GET /projects)**
  - Multi-criteria filtering
  - Geographic filtering
  - Status-based filtering
  - Featured projects

- ✅ **Project Dependencies**
  - City/location relationships
  - Builder associations
  - Amenity assignments

## 🛠️ Test Configuration

### Jest Configuration (jest-e2e.json)

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "setupFilesAfterEnv": ["<rootDir>/setup.ts"],
  "testTimeout": 30000,
  "maxWorkers": 1,
  "forceExit": true,
  "detectOpenHandles": true
}
```

### Environment Variables (.env.test)

```bash
NODE_ENV=test
MONGO_URI_TEST=mongodb://localhost:27017/trelax_test_db
JWT_SECRET=test_jwt_secret_key_for_e2e_tests_only
JWT_EXPIRES_IN=1h
SUPPRESS_LOGS=true
TEST_TIMEOUT=30000
```

## 🔧 Test Helper Functions

### TestHelper Class

```typescript
// Authentication
await TestHelper.login()
const authHeaders = await TestHelper.getAuthHeaders()

// Test Data Creation
const cityData = TestHelper.createTestCity()
const builderData = TestHelper.createTestBuilder()
const projectData = TestHelper.createTestProject(cityId, locationId, builderId)

// Assertions
TestHelper.expectSuccessResponse(response, 'Expected message')
TestHelper.expectErrorResponse(response, 400, 'Validation error')
TestHelper.expectUnauthorizedError(response)
TestHelper.expectNotFoundError(response)

// Cleanup
await TestHelper.cleanupTestData()
```

## 📈 Best Practices

### 1. Test Isolation
- Each test suite is independent
- Database cleanup between test runs
- No shared state between tests

### 2. Authentication
- Centralized authentication handling
- Token reuse within test suites
- Proper cleanup of auth state

### 3. Data Management
- Unique test data generation
- Proper cleanup after tests
- Idempotent test operations

### 4. Error Handling
- Comprehensive error scenario testing
- Validation error testing
- Security vulnerability testing

### 5. Performance
- Parallel test execution where possible
- Efficient database operations
- Timeout management

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check MongoDB is running
   # Verify connection string in .env.test
   # Ensure test database permissions
   ```

2. **Authentication Failures**
   ```bash
   # Verify JWT secret configuration
   # Check admin user credentials
   # Ensure auth endpoints are working
   ```

3. **Test Timeouts**
   ```bash
   # Increase timeout in jest-e2e.json
   # Check for hanging database connections
   # Verify test cleanup procedures
   ```

4. **Port Conflicts**
   ```bash
   # Use different port for tests (3001)
   # Ensure main app is not running on test port
   ```

### Debug Mode

```bash
# Run tests with debug output
npm run test:e2e -- --verbose --detectOpenHandles

# Run single test with full output
npm run test:e2e -- --testPathPattern=auth.e2e-spec.ts --verbose

# Debug specific test case
npm run test:e2e -- --testNamePattern="should login successfully"
```

## 📝 Adding New Tests

### 1. Create Test File

```typescript
// test/new-module.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestHelper } from './helpers/test-helper';

describe('New Module (e2e)', () => {
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

  // Add your tests here
});
```

### 2. Update Test Runner

Add your test suite to `test/run-tests.ts`:

```typescript
const testSuites: TestSuite[] = [
  // ... existing suites
  {
    name: 'New Module',
    file: 'new-module.e2e-spec.ts',
    description: 'New module CRUD operations',
    dependencies: ['Authentication'],
  },
];
```

### 3. Add Helper Functions

Extend `TestHelper` class with module-specific helpers:

```typescript
static createTestNewModule() {
  return {
    name: `Test Module ${Date.now()}`,
    // ... other fields
  };
}
```

## 🎯 Test Metrics

### Coverage Goals
- **Line Coverage**: > 80%
- **Function Coverage**: > 90%
- **Branch Coverage**: > 75%
- **Statement Coverage**: > 85%

### Performance Targets
- **Individual Test**: < 5 seconds
- **Test Suite**: < 30 seconds
- **Full Test Run**: < 5 minutes

### Quality Metrics
- **Test Reliability**: > 99%
- **False Positive Rate**: < 1%
- **Test Maintenance**: < 10% of development time
