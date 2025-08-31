const { body, param, query, validationResult } = require("express-validator");
const response = require("../utils/response");

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.error(res, "Validation failed", 400, {
      errors: errors.array(),
    });
  }
  next();
};

// Auth validators
const validateSignup = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "user", "read-only"])
    .withMessage("Role must be admin, user, or read-only"),
  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateForgotPassword = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  handleValidationErrors,
];

const validateResetPassword = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("otp")
    .isLength({ min: 4, max: 6 })
    .withMessage("OTP must be 4-6 characters"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  handleValidationErrors,
];

// Transaction validators
const validateCreateTransaction = [
  body("category_id")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  handleValidationErrors,
];

const validateUpdateTransaction = [
  param("id").isUUID().withMessage("Invalid transaction ID"),
  body("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  handleValidationErrors,
];

// Category validators
const validateCreateCategory = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  handleValidationErrors,
];

const validateUpdateCategory = [
  param("id").isInt({ min: 1 }).withMessage("Invalid category ID"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  handleValidationErrors,
];

// User validators
const validateUpdateUserRole = [
  param("id").isUUID().withMessage("Invalid user ID"),
  body("role")
    .isIn(["admin", "user", "read-only"])
    .withMessage("Role must be admin, user, or read-only"),
  handleValidationErrors,
];

const validateUpdateProfile = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  handleValidationErrors,
];

// Query parameter validators
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

const validateTransactionFilters = [
  query("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  query("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  query("start_date")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
  handleValidationErrors,
];

module.exports = {
  // Auth validators
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,

  // Transaction validators
  validateCreateTransaction,
  validateUpdateTransaction,

  // Category validators
  validateCreateCategory,
  validateUpdateCategory,

  // User validators
  validateUpdateUserRole,
  validateUpdateProfile,

  // Query validators
  validatePagination,
  validateTransactionFilters,
};
