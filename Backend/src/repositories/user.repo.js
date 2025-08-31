const pool = require("../config/db");

module.exports = {
  async createUser({ name, email, password, role = "user" }) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  async getAllUsers(limit = 10, offset = 0) {
    const query = `
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  },

  async getUserById(id) {
    const query = `
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async updateUser(id, updates) {
    let query;
    let values;

    if (updates.password && updates.role) {
      // Update password, role, name, and email
      query = `
        UPDATE users 
        SET name = $1, email = $2, password = $3, role = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING id, name, email, role, created_at, updated_at
      `;
      values = [
        updates.name,
        updates.email,
        updates.password,
        updates.role,
        id,
      ];
    } else if (updates.password) {
      // Update including password (name, email, password)
      query = `
        UPDATE users 
        SET name = $1, email = $2, password = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, name, email, role, created_at, updated_at
      `;
      values = [updates.name, updates.email, updates.password, id];
    } else if (updates.role) {
      // Update name, email, and role (no password)
      query = `
        UPDATE users 
        SET name = $1, email = $2, role = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, name, email, role, created_at, updated_at
      `;
      values = [updates.name, updates.email, updates.role, id];
    } else {
      // Update name and email only
      query = `
        UPDATE users 
        SET name = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, name, email, role, created_at, updated_at
      `;
      values = [updates.name, updates.email, id];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateUserRole(id, role) {
    const query = `
      UPDATE users 
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const result = await pool.query(query, [role, id]);
    return result.rows[0];
  },

  async deleteUser(id) {
    const query = `
      DELETE FROM users 
      WHERE id = $1 
      RETURNING id, name, email
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
