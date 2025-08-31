const transactionRepo = require("../repositories/transaction.repo");

module.exports = {
  async createTransaction(data) {
    return await transactionRepo.createTransaction(data);
  },

  async getTransactions(
    user_id,
    { page = 1, limit = 10, type, category_id, start_date, end_date }
  ) {
    const offset = (page - 1) * limit;
    return await transactionRepo.getUserTransactions(user_id, limit, offset, {
      type,
      category_id,
      start_date,
      end_date,
    });
  },

  async updateTransaction(id, user_id, updates) {
    return await transactionRepo.updateTransaction(id, user_id, updates);
  },

  async deleteTransaction(id, user_id) {
    return await transactionRepo.deleteTransaction(id, user_id);
  },
};
