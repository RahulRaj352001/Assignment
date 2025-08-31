const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure files run in order
    
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    for (const file of migrationFiles) {
      if (file === 'migrate.js') continue; // Skip this script
      
      console.log(`\n📝 Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the entire SQL file as one statement
      // This avoids issues with splitting complex SQL like functions and triggers
      await pool.query(sql);
      
      console.log(`✅ Completed: ${file}`);
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    console.log('📊 Database tables created and seeded.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
