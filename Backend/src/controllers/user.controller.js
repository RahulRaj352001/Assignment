const userRepo = require("../repositories/user.repo");
const response = require("../utils/response");

module.exports = {
  async getProfile(req, res) {
    try {
      const user = await userRepo.findById(req.user.id);
      if (!user) {
        return response.error(res, "User not found", 404);
      }

      // Remove password from response
      const { password, ...userProfile } = user;
      return response.success(
        res,
        userProfile,
        "Profile retrieved successfully"
      );
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;

      // Basic validation
      if (!name || !email) {
        return response.error(res, "Name and email are required", 400);
      }

      // Check if email is already taken by another user
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return response.error(res, "Email already in use", 400);
      }

      // Update user profile
      const updatedUser = await userRepo.updateUser(req.user.id, {
        name,
        email,
      });
      return response.success(res, updatedUser, "Profile updated successfully");
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userRepo.getAllUsers();
      return response.success(res, users, "Users retrieved successfully");
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },
};
