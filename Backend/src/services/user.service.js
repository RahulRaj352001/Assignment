const userRepo = require("../repositories/user.repo");

module.exports = {
  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await userRepo.getAllUsers(limit, offset);
  },

  async getUserById(id) {
    return await userRepo.getUserById(id);
  },

  async updateUserRole(id, role) {
    if (!["admin", "user", "read-only"].includes(role)) {
      const error = new Error("Invalid role");
      error.statusCode = 400;
      throw error;
    }
    return await userRepo.updateUserRole(id, role);
  },

  async deleteUser(id) {
    return await userRepo.deleteUser(id);
  },

  async updateUser(id, updates) {
    return await userRepo.updateUser(id, updates);
  },
};
