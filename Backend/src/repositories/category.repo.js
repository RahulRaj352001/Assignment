const pool = require("../config/db");

module.exports = {
  async createCategory({ name }) {
    const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  async getAllCategories() {
    const query = "SELECT * FROM categories ORDER BY name ASC";
    const result = await pool.query(query);
    return result.rows;
  },

  async updateCategory(id, { name }) {
    const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  },

  async deleteCategory(id) {
    const query = "DELETE FROM categories WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
