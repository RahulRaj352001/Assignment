const express = require("express");
const router = express.Router();
const userRepo = require("../repositories/user.repo");
const auth = require("../middleware/auth");
const permit = require("../middleware/rbac");
const response = require("../utils/response");

// GET /api/users - Admin only
router.get("/", auth, permit("admin"), async (req, res) => {
  try {
    const users = await userRepo.getAllUsers();
    return response.success(res, users, "Fetched all users");
  } catch (err) {
    return response.error(res, err.message);
  }
});

module.exports = router;
