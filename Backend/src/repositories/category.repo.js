const pool = require("../config/db");

module.exports = {
  async getAllCategories() {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    return result.rows;
  },

  async createCategory(name) {
    const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },
};
