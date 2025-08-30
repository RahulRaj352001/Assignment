const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health Check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
