// Test setup file
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
process.env.REDIS_URL = "redis://localhost:6379";

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock rate limiting for tests
jest.mock("../src/middleware/rateLimit", () => ({
  authLimiter: (req, res, next) => next(),
  transactionLimiter: (req, res, next) => next(),
  analyticsLimiter: (req, res, next) => next(),
}));
