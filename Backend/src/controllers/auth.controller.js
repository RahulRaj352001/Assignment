const authService = require("../services/auth.service");
const response = require("../utils/response");

module.exports = {
  async signup(req, res, next) {
    try {
      const { name, email, password, role = "user" } = req.body;
      const { user, token } = await authService.signup({
        name,
        email,
        password,
        role,
      });
      return response.success(
        res,
        { user, token },
        "User registered successfully"
      );
    } catch (err) {
      return response.error(res, err.message, 400);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login({ email, password });
      return response.success(res, { user, token }, "Login successful");
    } catch (err) {
      return response.error(res, err.message, 401);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return response.error(res, "Email is required", 400);
      }

      const result = await authService.forgotPassword(email);
      return response.success(res, result, "Password reset OTP sent");
    } catch (err) {
      return response.error(res, err.message, 400);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return response.error(
          res,
          "Email, OTP, and new password are required",
          400
        );
      }

      if (newPassword.length < 6) {
        return response.error(
          res,
          "Password must be at least 6 characters long",
          400
        );
      }

      const result = await authService.resetPassword(email, otp, newPassword);
      return response.success(res, result, "Password reset successful");
    } catch (err) {
      return response.error(res, err.message, 400);
    }
  },
};
