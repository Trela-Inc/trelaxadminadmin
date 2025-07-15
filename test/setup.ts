/**
 * E2E Test Setup
 * Global setup for all e2e tests
 */

// Increase timeout for all tests
jest.setTimeout(30000);

// Global test configuration
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_for_e2e_tests';
  process.env.JWT_EXPIRES_IN = '1h';
  
  // Use test database
  if (!process.env.MONGO_URI_TEST) {
    process.env.MONGO_URI_TEST = process.env.MONGO_URI?.replace(/\/[^\/]*$/, '/trelax_test_db') || 
                                  'mongodb://localhost:27017/trelax_test_db';
  }
});

// Global cleanup
afterAll(async () => {
  // Add any global cleanup here
});

// Suppress console logs during tests (optional)
if (process.env.SUPPRESS_LOGS === 'true') {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
}
