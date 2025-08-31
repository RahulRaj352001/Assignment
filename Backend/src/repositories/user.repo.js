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

  async getAllUsers() {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async updateUser(id, updates) {
    const { name, email } = updates;
    const query = `
      UPDATE users 
      SET name = $1, email = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const result = await pool.query(query, [name, email, id]);
    return result.rows[0];
  },
};
