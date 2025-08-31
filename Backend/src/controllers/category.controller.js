const categoryService = require("../services/category.service");
const response = require("../utils/response");

module.exports = {
  async create(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      return response.success(res, category, "Category created");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async list(req, res) {
    try {
      console.log("Listing categories");
      const categories = await categoryService.getAllCategories();
      return response.success(res, categories, "Categories fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category) return response.error(res, "Category not found", 404);
      return response.success(res, category, "Category updated");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      const category = await categoryService.deleteCategory(req.params.id);
      if (!category) return response.error(res, "Category not found", 404);
      return response.success(res, category, "Category deleted");
    } catch (err) {
      return response.error(res, err.message);
    }
  },
};
