// ============================================
// Travel Agency System - Main Server File
// ============================================

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware Configuration
// ============================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));

// ============================================
// Routes Import
// ============================================
const authRoutes = require('./routes/auth');
const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./routes/hotels');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// ============================================
// Serve HTML Pages
// ============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'customer-dashboard.html'));
});

app.get('/flight-search', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'flight-search.html'));
});

app.get('/hotel-search', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hotel-search.html'));
});

app.get('/packages', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'packages.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'payment.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// ============================================
// Ensure admin@travel.com exists with password admin123 (works on any machine)
// ============================================
async function ensureAdminUser() {
    try {
        const db = require('./config/database');
        const bcrypt = require('bcryptjs');
        const adminEmail = 'admin@travel.com';
        const adminPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [adminEmail]);
        if (existing.length > 0) {
            await db.execute(
                'UPDATE users SET password = ?, full_name = ?, user_type = ? WHERE email = ?',
                [hashedPassword, 'Admin User', 'admin', adminEmail]
            );
        } else {
            await db.execute(
                'INSERT INTO users (email, password, full_name, user_type) VALUES (?, ?, ?, ?)',
                [adminEmail, hashedPassword, 'Admin User', 'admin']
            );
        }
        console.log('Admin ready: admin@travel.com / admin123');
    } catch (err) {
        console.warn('Could not ensure admin user (DB may not be ready yet):', err.message);
    }
}

// ============================================
// Start Server with Port Conflict Handling
// ============================================
let server;
(async function start() {
    await ensureAdminUser();
    server = app.listen(PORT, () => {
        console.log(`Travel Agency Server running on http://localhost:${PORT}`);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}...`);
            server.close();
            app.listen(PORT + 1, () => {
                console.log(`Travel Agency Server running on http://localhost:${PORT + 1}`);
            });
        } else {
            console.error('Server error:', err);
        }
    });
})();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    if (server) server.close(() => { console.log('Server closed.'); process.exit(0); });
    else process.exit(0);
});

