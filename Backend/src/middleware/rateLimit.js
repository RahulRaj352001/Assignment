const rateLimit = require("express-rate-limit");
const response = require("../utils/response");

// Custom handler for JSON response
const handler = (req, res) => {
  return response.error(res, "Too many requests, please try again later.", 429);
};

module.exports = {
  authLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests
    handler,
  }),

  transactionLimiter: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests
    handler,
  }),

  analyticsLimiter: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 requests
    handler,
  }),
};
