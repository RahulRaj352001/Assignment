const jwt = require("jsonwebtoken");
const response = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.error(res, "No token provided", 401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return response.error(res, "Invalid token", 403);
    req.user = user; // { id, email, role }
    next();
  });
};
