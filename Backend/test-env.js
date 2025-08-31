require('dotenv').config();

console.log('=== Environment Variable Test ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'undefined');
console.log('DATABASE_URL type:', typeof process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  console.log('First 50 chars:', process.env.DATABASE_URL.substring(0, 50));
  console.log('Last 50 chars:', process.env.DATABASE_URL.substring(Math.max(0, process.env.DATABASE_URL.length - 50)));
}

console.log('=== Other Variables ===');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
