const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");

// GET categories - All roles
router.get(
  "/",
  auth,
  permit("admin", "user", "read-only"),
  categoryController.list
);

// POST create - Only admin
router.post("/", auth, permit("admin"), categoryController.create);

// PUT update - Only admin
router.put("/:id", auth, permit("admin"), categoryController.update);

// DELETE remove - Only admin
router.delete("/:id", auth, permit("admin"), categoryController.delete);

module.exports = router;
