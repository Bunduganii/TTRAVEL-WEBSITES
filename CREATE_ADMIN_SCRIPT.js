// ============================================
// Create Admin User Script
// Run this: node CREATE_ADMIN_SCRIPT.js
// ============================================

const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createAdmin() {
    try {
        // Admin credentials
        const adminEmail = 'admin@travel.com';
        const adminPassword = 'admin123';
        const adminName = 'Admin User';

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Check if admin already exists
        const [existing] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [adminEmail]
        );

        if (existing.length > 0) {
            // Update existing admin
            await db.execute(
                'UPDATE users SET password = ?, full_name = ?, user_type = ? WHERE email = ?',
                [hashedPassword, adminName, 'admin', adminEmail]
            );
            console.log('✅ Admin user updated successfully!');
        } else {
            // Create new admin
            await db.execute(
                'INSERT INTO users (email, password, full_name, user_type) VALUES (?, ?, ?, ?)',
                [adminEmail, hashedPassword, adminName, 'admin']
            );
            console.log('✅ Admin user created successfully!');
        }

        console.log('\n📋 ADMIN CREDENTIALS:');
        console.log('   Email: admin@travel.com');
        console.log('   Password: admin123');
        console.log('   User Type: admin');
        console.log('\n✅ You can now login at: http://localhost:3000');
        console.log('   Select "Admin" tab and use the credentials above\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

createAdmin();
