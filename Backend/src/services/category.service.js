const categoryRepo = require("../repositories/category.repo");
const redisClient = require("../config/redis");

const CACHE_KEY = "categories:list";

module.exports = {
  async createCategory(data) {
    const category = await categoryRepo.createCategory(data);
    await redisClient.del(CACHE_KEY); // invalidate cache
    return category;
  },

  async getAllCategories() {
    // 1️⃣ Check cache
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2️⃣ If not cached, fetch from DB
    const categories = await categoryRepo.getAllCategories();

    // 3️⃣ Store in cache for 1 hour
    await redisClient.setex(CACHE_KEY, 3600, JSON.stringify(categories));

    return categories;
  },

  async updateCategory(id, data) {
    const category = await categoryRepo.updateCategory(id, data);
    await redisClient.del(CACHE_KEY); // invalidate cache
    return category;
  },

  async deleteCategory(id) {
    const category = await categoryRepo.deleteCategory(id);
    await redisClient.del(CACHE_KEY); // invalidate cache
    return category;
  },
};
