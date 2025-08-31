const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middleware/rateLimit");
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validators");

// Signup & Login protected by rate limiter and validation
router.post("/register", authLimiter, validateSignup, authController.signup);
router.post("/login", authLimiter, validateLogin, authController.login);

// Password reset endpoints with validation
router.post(
  "/forgot-password",
  authLimiter,
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validateResetPassword,
  authController.resetPassword
);

module.exports = router;
