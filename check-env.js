// ============================================
// .env File Diagnostic Tool
// ============================================
// Run this to check if .env file is set up correctly: node check-env.js

const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('═══════════════════════════════════════════════════════════');
console.log('  .env FILE DIAGNOSTIC TOOL');
console.log('═══════════════════════════════════════════════════════════\n');

const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

// Check if .env file exists
if (!envExists) {
    console.log('❌ .env file NOT FOUND!');
    console.log('   Expected location:', envPath);
    console.log('\n📝 SOLUTION:');
    console.log('   1. Create a file named .env in the project root');
    console.log('   2. Add this content:');
    console.log('      DB_HOST=localhost');
    console.log('      DB_USER=root');
    console.log('      DB_PASSWORD=1234');
    console.log('      DB_NAME=travel_agency_db');
    console.log('      PORT=3000');
    console.log('      JWT_SECRET=secret123');
    console.log('   3. Replace 1234 with your actual MySQL password');
    console.log('   4. Save the file');
    process.exit(1);
}

console.log('✅ .env file found at:', envPath);
console.log('');

// Read and display .env file contents (mask password)
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));

console.log('📄 .env file contents:');
lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('DB_PASSWORD=')) {
        const password = trimmed.split('=')[1] || '';
        const masked = password ? '*'.repeat(Math.min(password.length, 10)) : '(empty)';
        console.log(`   ${trimmed.split('=')[0]}=${masked}`);
    } else {
        console.log(`   ${trimmed}`);
    }
});
console.log('');

// Check for common issues
let issues = [];

// Check if DB_PASSWORD is set
if (process.env.DB_PASSWORD === undefined) {
    issues.push('DB_PASSWORD is not set in .env file');
} else if (process.env.DB_PASSWORD === '') {
    issues.push('DB_PASSWORD is empty (this is OK if MySQL has no password)');
} else {
    console.log('✅ DB_PASSWORD is set:', '*'.repeat(Math.min(process.env.DB_PASSWORD.length, 10)));
}

// Check for quotes around password (common mistake)
if (envContent.includes('DB_PASSWORD="') || envContent.includes("DB_PASSWORD='")) {
    issues.push('⚠️  WARNING: DB_PASSWORD has quotes around it - remove them!');
    issues.push('   Wrong: DB_PASSWORD="1234"');
    issues.push('   Correct: DB_PASSWORD=1234');
}

// Check for spaces
if (envContent.includes('DB_PASSWORD =')) {
    issues.push('⚠️  WARNING: DB_PASSWORD has spaces around = sign');
    issues.push('   Wrong: DB_PASSWORD = 1234');
    issues.push('   Correct: DB_PASSWORD=1234');
}

// Display environment variables as loaded by dotenv
console.log('\n🔍 Environment variables loaded by dotenv:');
console.log('   DB_HOST:', process.env.DB_HOST || '(not set)');
console.log('   DB_USER:', process.env.DB_USER || '(not set)');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD !== undefined 
    ? `"${process.env.DB_PASSWORD}" (${process.env.DB_PASSWORD.length} chars)` 
    : '(not set)');
console.log('   DB_NAME:', process.env.DB_NAME || '(not set)');
console.log('   PORT:', process.env.PORT || '(not set)');

if (issues.length > 0) {
    console.log('\n⚠️  ISSUES FOUND:');
    issues.forEach(issue => console.log('   ' + issue));
} else {
    console.log('\n✅ .env file looks good!');
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('💡 TIP: Run "node test-db-connection.js" to test your password');
console.log('═══════════════════════════════════════════════════════════\n');
