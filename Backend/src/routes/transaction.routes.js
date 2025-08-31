const express = require("express");
const router = express.Router();
const transactionRepo = require("../repositories/transaction.repo");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const response = require("../utils/response");

// GET /api/transactions - All roles can view
router.get(
  "/",
  auth,
  permit("admin", "user", "read-only"),
  async (req, res) => {
    try {
      const transactions = await transactionRepo.getUserTransactions(
        req.user.id
      );
      return response.success(res, transactions, "Fetched transactions");
    } catch (err) {
      return response.error(res, err.message);
    }
  }
);

// POST /api/transactions - Only admin + user
router.post("/", auth, permit("admin", "user"), async (req, res) => {
  try {
    const newTx = await transactionRepo.createTransaction({
      user_id: req.user.id,
      ...req.body,
    });
    return response.success(res, newTx, "Transaction created");
  } catch (err) {
    return response.error(res, err.message);
  }
});

module.exports = router;
