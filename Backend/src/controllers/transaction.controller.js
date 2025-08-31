const transactionService = require("../services/transaction.service");
const response = require("../utils/response");

module.exports = {
  async create(req, res) {
    try {
      // Admin can create transactions for other users
      const user_id =
        req.user.role === "admin" && req.body.user_id
          ? req.body.user_id
          : req.user.id;

      const newTx = await transactionService.createTransaction({
        user_id,
        ...req.body,
      });
      return response.success(res, newTx, "Transaction created");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async list(req, res) {
    try {
      const { page, limit, type, category_id, start_date, end_date, user_id } =
        req.query;

      // Admin can view transactions for any user, regular users only see their own
      const target_user_id =
        req.user.role === "admin" && user_id ? user_id : req.user.id;

      const transactions = await transactionService.getTransactions(
        target_user_id,
        { page, limit, type, category_id, start_date, end_date }
      );
      return response.success(res, transactions, "Transactions fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async update(req, res) {
    try {
      // Admin can update any transaction, regular users only their own
      const target_user_id = req.user.role === "admin" ? null : req.user.id;

      const updatedTx = await transactionService.updateTransaction(
        req.params.id,
        target_user_id,
        req.body
      );
      if (!updatedTx)
        return response.error(
          res,
          "Transaction not found or not authorized",
          404
        );
      return response.success(res, updatedTx, "Transaction updated");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      // Admin can delete any transaction, regular users only their own
      const target_user_id = req.user.role === "admin" ? null : req.user.id;

      const deletedTx = await transactionService.deleteTransaction(
        req.params.id,
        target_user_id
      );
      if (!deletedTx)
        return response.error(
          res,
          "Transaction not found or not authorized",
          404
        );
      return response.success(res, deletedTx, "Transaction deleted");
    } catch (err) {
      return response.error(res, err.message);
    }
  },
};
