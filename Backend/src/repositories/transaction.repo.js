const pool = require("../config/db"); 

module.exports = {
  async createTransaction({ user_id, category_id, type, amount, description }) {
    const query = `
      INSERT INTO transactions (user_id, category_id, type, amount, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [user_id, category_id, type, amount, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserTransactions(user_id, limit = 10, offset = 0) {
    const query = `
      SELECT t.*, c.name AS category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [user_id, limit, offset]);
    return result.rows;
  },

  async deleteTransaction(id, user_id) {
    const query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [id, user_id]);
    return result.rows[0];
  },
};
