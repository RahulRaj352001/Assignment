const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const { transactionLimiter } = require("../middleware/rateLimit");

// GET transactions (all roles)
router.get(
  "/",
  auth,
  permit("admin", "user", "read-only"),
  transactionLimiter,
  transactionController.list
);

// POST create (admin + user only)
router.post(
  "/",
  auth,
  permit("admin", "user"),
  transactionLimiter,
  transactionController.create
);

// PUT update (admin + user only)
router.put(
  "/:id",
  auth,
  permit("admin", "user"),
  transactionLimiter,
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
