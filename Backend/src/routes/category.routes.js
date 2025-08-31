const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require("../middleware/validators");

// GET categories - All roles
router.get(
  "/",
  auth,
  permit("admin", "user", "read-only"),
  categoryController.list
);

// POST create - Only admin with validation
router.post(
  "/",
  auth,
  permit("admin"),
  validateCreateCategory,
  categoryController.create
);

// PUT update - Only admin with validation
router.put(
  "/:id",
  auth,
  permit("admin"),
  validateUpdateCategory,
  categoryController.update
);

// DELETE remove - Only admin
router.delete("/:id", auth, permit("admin"), categoryController.delete);

module.exports = router;
