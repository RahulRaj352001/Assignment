// Reference only (not ORM, not Sequelize)
module.exports = {
  id: "uuid",
  name: "string",
  email: "string (unique)",
  password: "hashed string",
  role: "enum: admin | user | read-only",
  created_at: "timestamp",
  updated_at: "timestamp",
};
