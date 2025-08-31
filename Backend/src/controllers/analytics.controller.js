const analyticsService = require("../services/analytics.service");
const response = require("../utils/response");

module.exports = {
  async monthlySummary(req, res) {
    try {
      const data = await analyticsService.getMonthlySummary(req.user.id);
      return response.success(res, data, "Monthly summary fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async categoryBreakdown(req, res) {
    try {
      const data = await analyticsService.getCategoryBreakdown(req.user.id);
      return response.success(res, data, "Category breakdown fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async incomeVsExpense(req, res) {
    try {
      const data = await analyticsService.getIncomeVsExpense(req.user.id);
      return response.success(res, data, "Income vs Expense fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },
};
