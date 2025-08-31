const userRepo = require("../repositories/user.repo");
const response = require("../utils/response");
const bcrypt = require("bcrypt");

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
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const users = await userRepo.getAllUsers(limit, offset);
      return response.success(res, users, "Users retrieved successfully");
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async getUserById(req, res) {
    try {
      const user = await userRepo.getUserById(req.params.id);
      if (!user) {
        return response.error(res, "User not found", 404);
      }
      return response.success(res, user, "User retrieved successfully");
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;

      if (!role || !["admin", "user", "read-only"].includes(role)) {
        return response.error(
          res,
          "Valid role (admin, user, read-only) is required",
          400
        );
      }

      const updatedUser = await userRepo.updateUserRole(req.params.id, role);
      if (!updatedUser) {
        return response.error(res, "User not found", 404);
      }

      return response.success(
        res,
        updatedUser,
        "User role updated successfully"
      );
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await userRepo.deleteUser(req.params.id);
      if (!deletedUser) {
        return response.error(res, "User not found", 404);
      }
      return response.success(res, deletedUser, "User deleted successfully");
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async createUser(req, res) {
    try {
      const { name, email, password, role = "user" } = req.body;

      // Basic validation
      if (!name || !email || !password) {
        return response.error(
          res,
          "Name, email, and password are required",
          400
        );
      }

      // Check if email is already taken
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser) {
        return response.error(res, "Email already in use", 400);
      }

      // Validate role
      if (!["admin", "user", "read-only"].includes(role)) {
        return response.error(res, "Invalid role", 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await userRepo.createUser({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return response.success(
        res,
        userWithoutPassword,
        "User created successfully"
      );
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },

  async updateUser(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const userId = req.params.id;

      // Basic validation
      if (!name || !email) {
        return response.error(res, "Name and email are required", 400);
      }

      // Check if email is already taken by another user
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return response.error(res, "Email already in use", 400);
      }

      // Validate role if provided
      if (role && !["admin", "user", "read-only"].includes(role)) {
        return response.error(res, "Invalid role", 400);
      }

      // Prepare update data
      const updateData = { name, email };
      if (password) {
        // Hash the new password
        updateData.password = await bcrypt.hash(password, 10);
      }
      if (role) {
        updateData.role = role;
      }

      // Update user
      const updatedUser = await userRepo.updateUser(userId, updateData);
      if (!updatedUser) {
        return response.error(res, "User not found", 404);
      }

      return response.success(res, updatedUser, "User updated successfully");
    } catch (err) {
      return response.error(res, err.message, 500);
    }
  },
};
