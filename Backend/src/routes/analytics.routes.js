const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const { analyticsLimiter } = require("../middleware/rateLimit");

// All analytics endpoints → all roles allowed
router.get(
  "/monthly",
  auth,
  permit("admin", "user", "read-only"),
  analyticsLimiter,
  analyticsController.monthlySummary
);

router.get(
  "/categories",
  auth,
  permit("admin", "user", "read-only"),
  analyticsLimiter,
  analyticsController.categoryBreakdown
);

router.get(
  "/income-expense",
  auth,
  permit("admin", "user", "read-only"),
  analyticsLimiter,
  analyticsController.incomeVsExpense
);

module.exports = router;
