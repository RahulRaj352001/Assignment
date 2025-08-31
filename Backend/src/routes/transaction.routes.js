const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const { transactionLimiter } = require("../middleware/rateLimit");
const {
  validateCreateTransaction,
  validateUpdateTransaction,
  validatePagination,
  validateTransactionFilters,
} = require("../middleware/validators");

// GET transactions (all roles) with pagination and filter validation
router.get(
  "/",
  auth,
  permit("admin", "user", "read-only"),
  transactionLimiter,
  validatePagination,
  validateTransactionFilters,
  transactionController.list
);

// POST create (admin + user only) with validation
router.post(
  "/",
  auth,
  permit("admin", "user"),
  transactionLimiter,
  validateCreateTransaction,
  transactionController.create
);

// PUT update (admin + user only) with validation
router.put(
  "/:id",
  auth,
  permit("admin", "user"),
  transactionLimiter,
  validateUpdateTransaction,
  transactionController.update
);

// DELETE remove (admin + user only)
router.delete(
  "/:id",
  auth,
  permit("admin", "user"),
  transactionLimiter,
  transactionController.delete
);

module.exports = router;
