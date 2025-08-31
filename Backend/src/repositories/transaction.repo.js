const pool = require("../config/db");

module.exports = {
  async createTransaction({
    user_id,
    category_id,
    type,
    amount,
    description,
    transaction_date,
  }) {
    const query = `
      INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      user_id,
      category_id,
      type,
      amount,
      description,
      transaction_date || new Date(),
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getUserTransactions(
    user_id,
    limit,
    offset,
    { type, category_id, start_date, end_date }
  ) {
    let filters = [];
    let params = [];
    let idx = 1;

    // If user_id is provided, filter by it (for regular users)
    // If user_id is null, admin can see all transactions
    if (user_id) {
      filters.push(`t.user_id = $${idx++}`);
      params.push(user_id);
    }

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

    // Get total count first
    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
      SELECT t.*, c.name AS category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY t.transaction_date DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
      transactions: result.rows,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async updateTransaction(
    id,
    user_id,
    { category_id, type, amount, description }
  ) {
    // If user_id is null, admin can update any transaction
    const userFilter = user_id ? `AND user_id = $6` : "";
    const query = `
      UPDATE transactions
      SET category_id = $1, type = $2, amount = $3, description = $4, updated_at = NOW()
      WHERE id = $5 ${userFilter}
      RETURNING *
    `;
    const params = [category_id, type, amount, description, id];
    if (user_id) params.push(user_id);

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async deleteTransaction(id, user_id) {
    // If user_id is null, admin can delete any transaction
    const userFilter = user_id ? `AND user_id = $2` : "";
    const query = `DELETE FROM transactions WHERE id = $1 ${userFilter} RETURNING *`;

    const params = [id];
    if (user_id) params.push(user_id);

    const result = await pool.query(query, params);
    return result.rows[0];
  },
};
