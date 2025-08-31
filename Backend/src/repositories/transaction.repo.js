const pool = require("../config/db");

module.exports = {
  async createTransaction({ user_id, category_id, type, amount, description }) {
    const query = `
      INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const values = [user_id, category_id, type, amount, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserTransactions(
    user_id,
    limit,
    offset,
    { type, category_id, start_date, end_date }
  ) {
    let filters = [`t.user_id = $1`];
    let params = [user_id];
    let idx = 2;

    if (type) {
      filters.push(`t.type = $${idx++}`);
      params.push(type);
    }
    if (category_id) {
      filters.push(`t.category_id = $${idx++}`);
      params.push(category_id);
    }
    if (start_date && end_date) {
      filters.push(`t.transaction_date BETWEEN $${idx++} AND $${idx++}`);
      params.push(start_date, end_date);
    }

    const query = `
      SELECT t.*, c.name AS category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${filters.join(" AND ")}
      ORDER BY t.transaction_date DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  async updateTransaction(
    id,
    user_id,
    { category_id, type, amount, description }
  ) {
    const query = `
      UPDATE transactions
      SET category_id = $1, type = $2, amount = $3, description = $4, updated_at = NOW()
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [
      category_id,
      type,
      amount,
      description,
      id,
      user_id,
    ]);
    return result.rows[0];
  },

  async deleteTransaction(id, user_id) {
    const query =
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(query, [id, user_id]);
    return result.rows[0];
  },
};
