const analyticsService = require("../services/analytics.service");
const response = require("../utils/response");

module.exports = {
  async monthlySummary(req, res) {
    try {
      // Admin can view analytics for any user, regular users only see their own
      const { user_id } = req.query;
      const target_user_id =
        req.user.role === "admin" && user_id ? user_id : req.user.id;

      const data = await analyticsService.getMonthlySummary(target_user_id);
      return response.success(res, data, "Monthly summary fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async categoryBreakdown(req, res) {
    try {
      // Admin can view analytics for any user, regular users only see their own
      const { user_id } = req.query;
      const target_user_id =
        req.user.role === "admin" && user_id ? user_id : req.user.id;

      const data = await analyticsService.getCategoryBreakdown(target_user_id);
      return response.success(res, data, "Category breakdown fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async incomeVsExpense(req, res) {
    try {
      // Admin can view analytics for any user, regular users only see their own
      const { user_id } = req.query;
      const target_user_id =
        req.user.role === "admin" && user_id ? user_id : req.user.id;

      const data = await analyticsService.getIncomeVsExpense(target_user_id);
      return response.success(res, data, "Income vs Expense fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async refreshCache(req, res) {
    try {
      const { user_id } = req.query;
      await analyticsService.refreshCache(user_id);
      return response.success(res, null, "Cache refreshed successfully for user " + user_id);
    } catch (err) {
      return response.error(res, err.message);
    }
  },
};
