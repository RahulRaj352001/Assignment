const transactionRepo = require("../repositories/transaction.repo");

module.exports = {
  async createTransaction(data) {
    // Ensure transaction_date is set
    if (!data.transaction_date) {
      data.transaction_date = new Date();
    }
    return await transactionRepo.createTransaction(data);
  },

  async getTransactions(
    user_id,
    { page = 1, limit = 10, type, category_id, start_date, end_date }
  ) {
    const offset = (page - 1) * limit;
    const result = await transactionRepo.getUserTransactions(
      user_id,
      limit,
      offset,
      {
        type,
        category_id,
        start_date,
        end_date,
      }
    );

    // Ensure we return the proper structure
    if (result && typeof result === "object" && result.transactions) {
      return result;
    }

    // Fallback for backward compatibility
    return {
      transactions: result || [],
      total: result ? result.length : 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((result ? result.length : 0) / limit),
    };
  },

  async updateTransaction(id, user_id, updates) {
    return await transactionRepo.updateTransaction(id, user_id, updates);
  },

  async deleteTransaction(id, user_id) {
    return await transactionRepo.deleteTransaction(id, user_id);
  },
};
