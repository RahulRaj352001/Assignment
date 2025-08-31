const response = require("../utils/response");

function permit(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, "Unauthorized", 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return response.error(res, "Forbidden: insufficient rights", 403);
    }
    next();
  };
}

module.exports = permit;
