const pool = require("../config/db");
const redisClient = require("../config/redis");

module.exports = {
  async getMonthlySummary(user_id) {
    const cacheKey = `analytics:monthly:${user_id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query = `
      SELECT 
        DATE_TRUNC('month', transaction_date) AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
    const result = await pool.query(query, [user_id]);
    await redisClient.setEx(cacheKey, 900, JSON.stringify(result.rows)); // 15 min
    return result.rows;
  },

  async getCategoryBreakdown(user_id) {
    const cacheKey = `analytics:categories:${user_id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query = `
      SELECT c.name AS category, SUM(t.amount) AS total
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 AND t.type = 'expense'
      GROUP BY c.name
      ORDER BY total DESC
    `;
    const result = await pool.query(query, [user_id]);
    await redisClient.setEx(cacheKey, 900, JSON.stringify(result.rows)); // 15 min
    return result.rows;
  },

  async getIncomeVsExpense(user_id) {
    const cacheKey = `analytics:income-expense:${user_id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query = `
      SELECT
        DATE_TRUNC('month', transaction_date) AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month ASC
    `;
    const result = await pool.query(query, [user_id]);
    await redisClient.setEx(cacheKey, 900, JSON.stringify(result.rows)); // 15 min
    return result.rows;
  },
};
