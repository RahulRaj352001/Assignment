module.exports = {
  id: "uuid",
  user_id: "uuid (FK users.id)",
  category_id: "int (FK categories.id)",
  type: "enum: income | expense",
  amount: "decimal",
  description: "string",
  transaction_date: "timestamp",
  created_at: "timestamp",
  updated_at: "timestamp",
};
