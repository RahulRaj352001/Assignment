const transactionService = require("../services/transaction.service");
const response = require("../utils/response");

module.exports = {
  async create(req, res) {
    try {
      const newTx = await transactionService.createTransaction({
        user_id: req.user.id,
        ...req.body,
      });
      return response.success(res, newTx, "Transaction created");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async list(req, res) {
    try {
      const { page, limit, type, category_id, start_date, end_date } =
        req.query;
      const transactions = await transactionService.getTransactions(
        req.user.id,
        { page, limit, type, category_id, start_date, end_date }
      );
      return response.success(res, transactions, "Transactions fetched");
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const updatedTx = await transactionService.updateTransaction(
        req.params.id,
        req.user.id,
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
      const deletedTx = await transactionService.deleteTransaction(
        req.params.id,
        req.user.id
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
