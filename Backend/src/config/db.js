const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL (Supabase)");
});

module.exports = pool;
