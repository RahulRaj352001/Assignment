const Redis = require("ioredis");
require("dotenv").config();

// Global state to ensure single initialization
let redisInstance = null;
let hasAttemptedConnection = false;

// Simple mock client for when Redis is unavailable
const mockRedisClient = {
  status: "offline",
  get: async () => null,
  set: async () => "OK",
  setex: async () => "OK",
  del: async () => 1,
  quit: async () => "OK",
  disconnect: () => {},
};

const createRedisClient = () => {
  // Return existing instance if already created
  if (redisInstance !== null) {
    return redisInstance;
  }

  // Only attempt connection once
  if (hasAttemptedConnection) {
    return mockRedisClient;
  }

  hasAttemptedConnection = true;

  // Check if Redis URL is available
  if (!process.env.REDIS_URL) {
    console.log("⚠️ No REDIS_URL found, using offline mode");
    redisInstance = mockRedisClient;
    return redisInstance;
  }

  try {
    const client = new Redis(process.env.REDIS_URL, {
      tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: false, // Connect immediately
      // Disable reconnection completely
      retryDelayOnFailover: null,
      retryDelayOnReconnect: null,
      autoResubscribe: false,
      autoResendUnfulfilledCommands: false,
      connectTimeout: 3000,
    });

    // Single event listeners - no reconnection logic
    client.once("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    client.once("error", (err) => {
      console.error("❌ Redis connection failed:", err.message);
      console.log("⚠️ Falling back to offline mode");
      redisInstance = mockRedisClient;
      client.disconnect();
    });

    redisInstance = client;
    return redisInstance;
  } catch (error) {
    console.warn(
      "⚠️ Redis initialization failed, using offline mode:",
      error.message
    );
    redisInstance = mockRedisClient;
    return redisInstance;
  }
};

// Initialize and export
module.exports = createRedisClient();
