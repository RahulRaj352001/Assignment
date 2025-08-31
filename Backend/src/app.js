const express = require("express");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const transactionRoutes = require("./routes/transaction.routes");
const categoryRoutes = require("./routes/category.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const pool = require("./config/db");
const redisClient = require("./config/redis");

require("dotenv").config();

const app = express();

pool.connect();

// ✅ Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(xssClean()); // Prevent XSS attacks
app.use(express.json({ limit: "10kb" })); // Prevent large payload DOS attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(compression());
app.use(morgan("dev"));

// ✅ CORS (restrict to frontend domain in production)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health Check route
app.get("/api/health", (req, res) => {
  const redisStatus =
    redisClient.status === "ready" ? "connected" : "disconnected";

  res.json({
    status: "ok",
    message: "Backend running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    redis: redisStatus,
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// User routes (protected)
app.use("/api/users", userRoutes);

// Transaction routes (protected)
app.use("/api/transactions", transactionRoutes);

// Category routes (protected)
app.use("/api/categories", categoryRoutes);

// Analytics routes (protected)
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
