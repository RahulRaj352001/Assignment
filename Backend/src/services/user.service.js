const userRepo = require("../repositories/user.repo");
const redisClient = require("../config/redis");

// Helper functions for user caching
const getCachedUser = async (key) => {
  try {
    if (redisClient && redisClient.status === "ready") {
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  } catch (error) {
    console.warn(`Redis cache get failed for key ${key}:`, error.message);
    return null;
  }
};

const setCachedUser = async (key, user, expiry = 300) => {
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.setex(key, expiry, JSON.stringify(user));
    }
  } catch (error) {
    console.warn(`Redis cache set failed for key ${key}:`, error.message);
  }
};

const invalidateUserCache = async (userId) => {
  const cacheKeys = [`user:${userId}`, "users:list"];

  for (const key of cacheKeys) {
    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.del(key);
      }
    } catch (error) {
      console.warn(
        `Redis cache deletion failed for key ${key}:`,
        error.message
      );
    }
  }

  // Also invalidate paginated user lists
  try {
    if (redisClient && redisClient.status === "ready") {
      const keys = await redisClient.keys("users:list:*");
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }
  } catch (error) {
    console.warn("Redis paginated cache deletion failed:", error.message);
  }
};

module.exports = {
  async getAllUsers(page = 1, limit = 10) {
    const cacheKey = `users:list:${page}:${limit}`;
    const cached = await getCachedUser(cacheKey);
    if (cached) return cached;

    const offset = (page - 1) * limit;
    const result = await userRepo.getAllUsers(limit, offset);

    await setCachedUser(cacheKey, result, 600); // Cache for 10 minutes
    return result;
  },

  async getUserById(id) {
    const cacheKey = `user:${id}`;
    const cached = await getCachedUser(cacheKey);
    if (cached) return cached;

    const user = await userRepo.getUserById(id);
    if (user) {
      await setCachedUser(cacheKey, user, 300); // Cache for 5 minutes
    }
    return user;
  },

  async updateUserRole(id, role) {
    if (!["admin", "user", "read-only"].includes(role)) {
      const error = new Error("Invalid role");
      error.statusCode = 400;
      throw error;
    }
    const user = await userRepo.updateUserRole(id, role);

    // Invalidate user cache after role update
    await invalidateUserCache(id);

    return user;
  },

  async deleteUser(id) {
    const user = await userRepo.deleteUser(id);

    // Invalidate user cache after deletion
    await invalidateUserCache(id);

    return user;
  },

  async updateUser(id, updates) {
    const user = await userRepo.updateUser(id, updates);

    // Invalidate user cache after update
    await invalidateUserCache(id);

    return user;
  },
};
