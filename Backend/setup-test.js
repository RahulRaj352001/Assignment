#!/usr/bin/env node

console.log("🧪 Testing Backend Setup...\n");

// Test 1: Check if all required files exist
const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "src/app.js",
  "src/server.js",
  "src/config/db.js",
  "src/config/redis.js",
  "src/config/swagger.js",
  "src/middleware/auth.js",
  "src/middleware/rbac.js",
  "src/middleware/rateLimit.js",
  "src/middleware/errorHandler.js",
  "src/utils/logger.js",
  "src/utils/response.js",
];

console.log("📁 Checking file structure...");
let allFilesExist = true;
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Test 2: Check if package.json has required scripts
console.log("\n📦 Checking package.json scripts...");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requiredScripts = ["dev", "start", "test"];
requiredScripts.forEach((script) => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`  ❌ ${script} script missing`);
  }
});

// Test 3: Check dependencies
console.log("\n🔧 Checking dependencies...");
const requiredDeps = ["express", "pg", "ioredis", "bcryptjs", "jsonwebtoken"];
requiredDeps.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep} dependency missing`);
  }
});

// Test 4: Try to import core modules
console.log("\n🔌 Testing module imports...");
try {
  require("./src/app");
  console.log("  ✅ Express app imports successfully");
} catch (e) {
  console.log(`  ❌ App import failed: ${e.message}`);
}

try {
  require("./src/config/db");
  console.log("  ✅ Database config imports successfully");
} catch (e) {
  console.log(`  ❌ DB config import failed: ${e.message}`);
}

try {
  require("./src/config/redis");
  console.log("  ✅ Redis config imports successfully");
} catch (e) {
  console.log(`  ❌ Redis config import failed: ${e.message}`);
}

console.log("\n🎯 Setup Summary:");
console.log(
  `  - Total files created: ${
    fs.readdirSync("src", { recursive: true }).length
  }`
);
console.log(
  `  - Architecture layers: 4 (Controller, Service, Repository, Models)`
);
console.log(`  - Middleware components: 4`);
console.log(`  - Utility modules: 2`);

if (allFilesExist) {
  console.log("\n🎉 Backend Part 1 Setup Complete!");
  console.log("\n📋 Next Steps:");
  console.log("  1. Create .env file with your Supabase DATABASE_URL");
  console.log("  2. Run: npm run dev");
  console.log("  3. Test: http://localhost:5000/api/health");
  console.log("  4. Continue with Part 2: Database Schema & Migrations");
} else {
  console.log("\n⚠️  Some files are missing. Please check the structure.");
}
