const pool = require("../config/db");
const redisClient = require("../config/redis");

// Helper function for Redis operations with error handling
const setCacheWithExpiry = async (key, value, expirySeconds) => {
  try {
    // Check if Redis is connected
    if (redisClient.status === "ready") {
      await redisClient.setex(key, expirySeconds, JSON.stringify(value));
    }
  } catch (error) {
    console.warn(`Redis cache set failed for key ${key}:`, error.message);
    // Continue without caching if Redis fails
  }
};

const getCache = async (key) => {
  try {
    // Check if Redis is connected
    if (redisClient.status === "ready") {
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  } catch (error) {
    console.warn(`Redis cache get failed for key ${key}:`, error.message);
    return null;
  }
};

module.exports = {
  async getMonthlySummary(user_id) {
    const cacheKey = `analytics:monthly:${user_id}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', transaction_date), 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
    const result = await pool.query(query, [user_id]);

    // Format data for frontend charts
    const formattedData = result.rows.map((row) => ({
      month: row.month,
      income: parseFloat(row.total_income || 0),
      expense: parseFloat(row.total_expense || 0),
      balance:
        parseFloat(row.total_income || 0) - parseFloat(row.total_expense || 0),
    }));

    await setCacheWithExpiry(cacheKey, formattedData, 900); // 15 min
    return formattedData;
  },

  async getCategoryBreakdown(user_id) {
    const cacheKey = `analytics:categories:${user_id}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT c.name AS category, COALESCE(SUM(t.amount), 0) AS total
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 AND t.type = 'expense'
      GROUP BY c.name
      ORDER BY total DESC
      LIMIT 10
    `;
    const result = await pool.query(query, [user_id]);

    // Format data for frontend charts
    const formattedData = result.rows.map((row) => ({
      category: row.category || "Uncategorized",
      amount: parseFloat(row.total || 0),
      percentage: 0, // Will be calculated in frontend
    }));

    await setCacheWithExpiry(cacheKey, formattedData, 900); // 15 min
    return formattedData;
  },

  async getIncomeVsExpense(user_id) {
    const cacheKey = `analytics:income-expense:${user_id}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT
        TO_CHAR(DATE_TRUNC('month', transaction_date), 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `;
    const result = await pool.query(query, [user_id]);

    // Format data for frontend charts
    const formattedData = result.rows.map((row) => ({
      month: row.month,
      income: parseFloat(row.income || 0),
      expense: parseFloat(row.expense || 0),
    }));

    await setCacheWithExpiry(cacheKey, formattedData, 900); // 15 min
    return formattedData;
  },

  refreshCache: async (user_id) => {
    const cacheKeyanalyticsMonthly = `analytics:monthly:${user_id}`;
    await redisClient.del(cacheKeyanalyticsMonthly);
    const cacheKeyanalyticsCategories = `analytics:categories:${user_id}`;
    await redisClient.del(cacheKeyanalyticsCategories);
    const cacheKeyanalyticsIncomeExpense = `analytics:income-expense:${user_id}`;
    await redisClient.del(cacheKeyanalyticsIncomeExpense);
  },
};
