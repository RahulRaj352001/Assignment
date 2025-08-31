const app = require("./app");
const pool = require("./config/db");
const redis = require("./config/redis");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5001;

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("\n🔄 Shutting down gracefully...");

  try {
    await pool.end();
    await redis.quit();
    console.log("✅ Database connections closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
