const categoryRepo = require("../repositories/category.repo");
const redisClient = require("../config/redis");

const CACHE_KEY = "categories:list";

module.exports = {
  async createCategory(data) {
    const category = await categoryRepo.createCategory(data);
    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.del(CACHE_KEY);
      }
    } catch (error) {
      console.warn("Redis cache invalidation failed:", error.message);
    }
    return category;
  },

  async getAllCategories() {
    // 1️⃣ Check cache
    try {
      if (redisClient && redisClient.status === "ready") {
        const cached = await redisClient.get(CACHE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.warn("Redis cache get failed:", error.message);
    }

    // 2️⃣ If not cached, fetch from DB
    const categories = await categoryRepo.getAllCategories();

    // 3️⃣ Store in cache for 1 hour
    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.setex(CACHE_KEY, 3600, JSON.stringify(categories));
      }
    } catch (error) {
      console.warn("Redis cache set failed:", error.message);
    }

    return categories;
  },

  async updateCategory(id, data) {
    const category = await categoryRepo.updateCategory(id, data);
    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.del(CACHE_KEY);
      }
    } catch (error) {
      console.warn("Redis cache invalidation failed:", error.message);
    }
    return category;
  },

  async deleteCategory(id) {
    const category = await categoryRepo.deleteCategory(id);
    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.del(CACHE_KEY);
      }
    } catch (error) {
      console.warn("Redis cache invalidation failed:", error.message);
    }
    return category;
  },
};
