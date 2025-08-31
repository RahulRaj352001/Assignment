const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const {
  validateUpdateUserRole,
  validateUpdateProfile,
  validatePagination,
} = require("../middleware/validators");

// Admin-only routes for user management with validation
router.get(
  "/",
  auth,
  permit("admin"),
  validatePagination,
  userController.getAllUsers
);

router.get("/:id", auth, permit("admin"), userController.getUserById);

router.put(
  "/:id/role",
  auth,
  permit("admin"),
  validateUpdateUserRole,
  userController.updateUserRole
);

router.delete("/:id", auth, permit("admin"), userController.deleteUser);

// User profile routes (for authenticated users) with validation
router.get("/profile/me", auth, userController.getProfile);

router.put(
  "/profile/me",
  auth,
  validateUpdateProfile,
  userController.updateProfile
);

module.exports = router;
