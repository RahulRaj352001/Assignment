const authService = require("../services/auth.service");
const response = require("../utils/response");

module.exports = {
  async signup(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
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
};
