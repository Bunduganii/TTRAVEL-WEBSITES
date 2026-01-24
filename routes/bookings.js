// ============================================
// Booking Routes
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ============================================
// Create Booking
// ============================================
router.post('/', async (req, res) => {
    try {
        const { userId, bookingType, flightId, hotelId, packageId, bookingDate, checkInDate, checkOutDate, travelers, totalAmount, paymentMethod } = req.body;
        
        const [result] = await db.execute(
            `INSERT INTO bookings (user_id, booking_type, flight_id, hotel_id, package_id, booking_date, check_in_date, check_out_date, travelers, total_amount, payment_method, payment_status, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', 'confirmed')`,
            [userId, bookingType, flightId || null, hotelId || null, packageId || null, bookingDate, checkInDate, checkOutDate, travelers, totalAmount, paymentMethod]
        );
        
        res.json({
            success: true,
            message: 'Booking completed successfully',
            bookingId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get User Bookings
// ============================================
router.get('/user/:userId', async (req, res) => {
    try {
        const [bookings] = await db.execute(
            `SELECT b.*, 
                    f.airline, f.flight_number, f.origin_name, f.destination_name,
                    h.name as hotel_name, h.location as hotel_location, h.image_url as hotel_image_url,
                    p.title as package_title, p.destination as package_destination, p.image_url as package_image_url
             FROM bookings b
             LEFT JOIN flights f ON b.flight_id = f.id
             LEFT JOIN hotels h ON b.hotel_id = h.id
             LEFT JOIN packages p ON b.package_id = p.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.params.userId]
        );
        
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get All Bookings (Admin)
// ============================================
router.get('/', async (req, res) => {
    try {
        const [bookings] = await db.execute(
            `SELECT b.*, 
                    u.full_name, u.email,
                    f.airline, f.flight_number,
                    h.name as hotel_name, h.image_url as hotel_image_url,
                    p.title as package_title, p.image_url as package_image_url
             FROM bookings b
             LEFT JOIN users u ON b.user_id = u.id
             LEFT JOIN flights f ON b.flight_id = f.id
             LEFT JOIN hotels h ON b.hotel_id = h.id
             LEFT JOIN packages p ON b.package_id = p.id
             ORDER BY b.created_at DESC`
        );
        
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

