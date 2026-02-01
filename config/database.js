// ============================================
// Database Configuration
// ============================================

// Load environment variables first (in case this file is loaded before server.js)
const path = require('path');
const fs = require('fs');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

// Load .env file
const dotenvResult = require('dotenv').config({ path: envPath });

// Debug: Show what was loaded
if (envExists) {
    console.log('\n📄 .env file found at:', envPath);
    if (dotenvResult.error) {
        console.log('⚠️  Warning: Error loading .env:', dotenvResult.error.message);
    }
} else {
    console.log('\n⚠️  .env file NOT found at:', envPath);
    console.log('   Using default values from config/database.js');
}

const mysql = require('mysql2');

// ============================================
// Create Connection Pool - XAMPP Compatible
// ============================================
// Get password from environment - default is NO PASSWORD (empty)
// Use DB_PASSWORD=yourpass in .env only if your MySQL has a password set
let dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';

// Debug: Show what password will be used (masked for security)
const passwordDisplay = dbPassword ? `"${dbPassword}" (${dbPassword.length} chars)` : '(empty)';
console.log('🔑 Database password being used:', passwordDisplay);
console.log('📊 Environment variables loaded:');
console.log('   DB_HOST:', process.env.DB_HOST || '(default: 127.0.0.1)');
if (process.env.DB_PASSWORD !== undefined) {
    if (process.env.DB_PASSWORD === '') {
        console.log('   DB_PASSWORD: (empty - no password)');
    } else {
        console.log('   DB_PASSWORD:', `"${process.env.DB_PASSWORD}"`);
    }
} else {
    console.log('   DB_PASSWORD:', '(not set in .env, using empty - no password)');
}
console.log('   DB_USER:', process.env.DB_USER || '(default: root)');
console.log('   DB_NAME:', process.env.DB_NAME || '(default: travel_agency_db)');

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: 3306,
    user: process.env.DB_USER || 'root',
    password: dbPassword,
    database: process.env.DB_NAME || 'travel_agency_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
});

// ============================================
// Test Connection with Detailed Error Messages
// ============================================
pool.getConnection((err, connection) => {
    if (err) {
        console.error('\n❌ Database connection error:', err.message);
        console.error('Error code:', err.code);
        
        // Provide specific troubleshooting based on error
        if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
            console.log('\n🔧 PASSWORD AUTHENTICATION ERROR');
            console.log('   Current password being used:', dbPassword ? `"${dbPassword}"` : '(empty)');
            console.log('   .env file exists:', envExists ? 'Yes' : 'No');
            if (envExists) {
                console.log('   DB_PASSWORD from .env:', process.env.DB_PASSWORD !== undefined 
                    ? `"${process.env.DB_PASSWORD}"` 
                    : '(not set in .env, using default)');
            }
            console.log('\n   🔍 DIAGNOSTIC STEPS:');
            console.log('   1. Run: node check-env.js (to verify .env file)');
            console.log('   2. Run: node test-db-connection.js (to find correct password)');
            console.log('   3. Create/Update .env file with:');
            if (dbPassword === '') {
                console.log('      DB_PASSWORD=  (empty - no password)');
            } else {
                console.log('      DB_PASSWORD=your_password');
            }
            console.log('   4. Make sure .env file has NO quotes: DB_PASSWORD=1234 (not DB_PASSWORD="1234")');
            console.log('   5. Make sure .env file has NO spaces: DB_PASSWORD=1234 (not DB_PASSWORD = 1234)');
            console.log('   6. If password is empty, use: DB_PASSWORD=  (nothing after equals)');
            console.log('   7. Restart server after creating/updating .env file');
        } else if (err.code === 'ECONNREFUSED') {
            console.log('\n🔧 CONNECTION REFUSED');
            console.log('   Make sure MySQL is running in XAMPP!');
            console.log('   - Open XAMPP Control Panel');
            console.log('   - Click "Start" next to MySQL');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('\n🔧 DATABASE NOT FOUND');
            console.log('   Database name:', process.env.DB_NAME || 'travel_agency_db');
            console.log('   Make sure the database exists!');
            console.log('   - Open phpMyAdmin');
            console.log('   - Create database: travel_agency_db');
            console.log('   - Import schema.sql');
        }
        console.log('\n   See DATABASE_SETUP.md for detailed instructions\n');
    } else {
        console.log('✅ Database connected successfully');
        console.log('   Host:', process.env.DB_HOST || '127.0.0.1');
        console.log('   Database:', process.env.DB_NAME || 'travel_agency_db');
        connection.release();
    }
});

// ============================================
// Export Promise-based Pool
// ============================================
module.exports = pool.promise();

