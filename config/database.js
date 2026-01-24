// ============================================
// Database Configuration
// ============================================

// Load environment variables first (in case this file is loaded before server.js)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mysql = require('mysql2');

// ============================================
// Create Connection Pool - XAMPP Compatible
// ============================================
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1234', // Your MySQL password
    database: 'travel_agency_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
});

// ============================================
// Test Connection
// ============================================
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err.message);
        console.log('\n⚠️  TIP: Create a .env file with your MySQL password');
        console.log('   See env_template.txt for example\n');
    } else {
        console.log('✅ Database connected successfully');
        connection.release();
    }
});

// ============================================
// Export Promise-based Pool
// ============================================
module.exports = pool.promise();

