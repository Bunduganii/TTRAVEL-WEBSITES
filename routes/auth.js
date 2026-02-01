// ============================================
// Authentication Routes
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// ============================================
// Login Endpoint
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        
        // ============================================
        // Check if user exists
        // ============================================
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // ============================================
        // Customer vs Admin only
        // ============================================
        if (user.user_type === 'admin') {
            if (userType !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Use Admin login for this account.' 
                });
            }
        }
        if (user.user_type === 'customer') {
            if (userType !== 'customer') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Use Customer login for this account.' 
                });
            }
        }
        
        // Verify password with bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                user_type: user.user_type
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Register Endpoint - Customer Only
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, userType, phone } = req.body;
        
        // ============================================
        // Validate input
        // ============================================
        if (!email || !password || !fullName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, password, and full name are required.' 
            });
        }
        
        // ============================================
        // Only allow customer signups from public form
        // Staff/Agent/Admin accounts must be created by admin
        // ============================================
        if (userType && userType !== 'customer') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only customer accounts can be created through signup. Contact admin for admin access.' 
            });
        }
        
        // ============================================
        // Check if email already exists
        // ============================================
        let existingUsers;
        try {
            [existingUsers] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
        } catch (dbError) {
            console.error('Database query error:', dbError.message);
            if (dbError.message.includes("Unknown database")) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database "travel_agency_db" does not exist. Please create it in phpMyAdmin and import schema.sql' 
                });
            }
            if (dbError.message.includes("doesn't exist")) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Users table not found. Please import schema.sql in phpMyAdmin.' 
                });
            }
            throw dbError;
        }
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered. Please login instead.' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // ============================================
        // Always create as customer
        // ============================================
        const [result] = await db.execute(
            'INSERT INTO users (email, password, full_name, user_type, phone) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, fullName, 'customer', phone || null]
        );
        
        res.json({
            success: true,
            message: 'Account created successfully',
            userId: result.insertId
        });
    } catch (error) {
        // Handle different error types
        let errorMessage = error.message;
        
        if (error.message.includes('timeout')) {
            errorMessage = 'Database connection timeout. Please check MySQL is running in XAMPP.';
        } else if (error.message.includes('Access denied')) {
            errorMessage = 'Database access denied. Check your .env file MySQL password. Run: node check-env.js to verify .env file, then node test-db-connection.js to test password. See SETUP_NEW_INSTALLATION.md for help.';
        } else if (error.message.includes("Unknown database")) {
            errorMessage = 'Database "travel_agency_db" does not exist. Please create it in phpMyAdmin and import schema.sql';
        } else if (error.message.includes("doesn't exist")) {
            errorMessage = 'Users table not found. Please import schema.sql in phpMyAdmin.';
        } else if (error.message.includes('ECONNREFUSED')) {
            errorMessage = 'Cannot connect to MySQL. Make sure MySQL is running in XAMPP.';
        }
        
        console.error('Registration error:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Request body:', req.body);
        
        res.status(500).json({ success: false, message: errorMessage });
    }
});

module.exports = router;

