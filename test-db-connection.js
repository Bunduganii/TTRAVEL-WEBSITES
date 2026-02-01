// ============================================
// Database Connection Test Script
// ============================================
// Run this to test your MySQL connection: node test-db-connection.js

const mysql = require('mysql2');

const passwordsToTry = ['123', '', '1234', 'root', 'password'];
const host = '127.0.0.1';
const user = 'root';
const database = 'travel_agency_db';

console.log('🔍 Testing MySQL connection...\n');
console.log('Host:', host);
console.log('User:', user);
console.log('Database:', database);
console.log('Trying passwords:', passwordsToTry.join(', '), '\n');
console.log('⚠️  IMPORTANT: Make sure MySQL is running in XAMPP before testing!\n');

let connectionAttempts = 0;

function testConnection(password, index) {
    return new Promise((resolve) => {
        const testPassword = password === '' ? '(empty)' : password;
        console.log(`Attempt ${index + 1}: Testing password "${testPassword}"...`);
        
        const connection = mysql.createConnection({
            host: host,
            port: 3306,
            user: user,
            password: password,
            database: database,
            connectTimeout: 5000
        });

        connection.connect((err) => {
            if (err) {
                console.log(`   ❌ Failed: ${err.message}`);
                
                // Check for connection refused error
                if (err.code === 'ECONNREFUSED') {
                    console.log('   ⚠️  MySQL is NOT running! Start MySQL in XAMPP first.\n');
                } else {
                    console.log('');
                }
                
                // Safely close connection if it exists
                try {
                    if (connection && connection.state !== 'disconnected') {
                        connection.end();
                    }
                } catch (closeErr) {
                    // Ignore close errors
                }
                resolve(false);
            } else {
                console.log(`   ✅ SUCCESS! Password "${testPassword}" works!\n`);
                connection.query('SELECT DATABASE() as db', (err, results) => {
                    if (!err && results.length > 0) {
                        console.log(`   Connected to database: ${results[0].db}`);
                    }
                    try {
                        connection.end();
                    } catch (closeErr) {
                        // Ignore close errors
                    }
                    resolve(true);
                });
            }
        });
        
        // Handle connection errors that occur before connect callback
        connection.on('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                console.log(`   ❌ Failed: MySQL is NOT running!`);
                console.log('   ⚠️  Start MySQL in XAMPP Control Panel first.\n');
            }
        });
    });
}

async function runTests() {
    for (let i = 0; i < passwordsToTry.length; i++) {
        const success = await testConnection(passwordsToTry[i], i);
        if (success) {
            console.log('\n✅ FOUND WORKING PASSWORD!');
            console.log(`\n📝 Update your .env file with:`);
            console.log(`   DB_PASSWORD=${passwordsToTry[i] === '' ? '' : passwordsToTry[i]}`);
            console.log(`\n   Or update config/database.js default password to: '${passwordsToTry[i]}'`);
            return;
        }
    }
    
    console.log('\n❌ Connection failed or none of the tested passwords worked.');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. ⚠️  MOST COMMON: Make sure MySQL is running in XAMPP!');
    console.log('      - Open XAMPP Control Panel');
    console.log('      - Click "Start" next to MySQL');
    console.log('      - Wait until it shows "Running" (green)');
    console.log('   2. Check your MySQL password in phpMyAdmin');
    console.log('   3. Try connecting manually: mysql -u root -p');
    console.log('   4. If MySQL is not installed, install XAMPP: https://www.apachefriends.org/');
    console.log('   5. If no password works, you may need to reset MySQL password');
}

runTests().catch(console.error);
