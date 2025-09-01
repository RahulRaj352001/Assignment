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

require("dotenv").config();

const app = express();

pool.connect();

// Security and middleware setup
app.use(helmet());
app.use(xssClean());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(compression());
app.use(morgan("dev"));

// CORS configuration
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
    message: "Backend running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    redis: redisStatus,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
