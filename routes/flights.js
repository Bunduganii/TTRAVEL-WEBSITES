// ============================================
// Flight Routes
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ============================================
// Search Flights
// ============================================
router.get('/search', async (req, res) => {
    try {
        const { origin, destination, departureDate, returnDate, travelers } = req.query;
        
        let query = 'SELECT * FROM flights WHERE 1=1';
        const params = [];
        
        if (origin) {
            query += ' AND origin_code = ?';
            params.push(origin);
        }
        
        if (destination) {
            query += ' AND destination_code = ?';
            params.push(destination);
        }
        
        if (departureDate) {
            query += ' AND departure_date = ?';
            params.push(departureDate);
        }
        
        const [flights] = await db.execute(query, params);
        
        res.json({ success: true, flights });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get All Flights
// ============================================
router.get('/', async (req, res) => {
    try {
        const [flights] = await db.execute('SELECT * FROM flights ORDER BY departure_date DESC');
        res.json({ success: true, flights });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get Flight by ID
// ============================================
router.get('/:id', async (req, res) => {
    try {
        const [flights] = await db.execute('SELECT * FROM flights WHERE id = ?', [req.params.id]);
        
        if (flights.length === 0) {
            return res.status(404).json({ success: false, message: 'Flight not found' });
        }
        
        res.json({ success: true, flight: flights[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Create Flight (Admin)
// ============================================
router.post('/', async (req, res) => {
    try {
        const { airline, flight_number, origin_code, origin_name, destination_code, destination_name, departure_date, departure_time, arrival_date, arrival_time, price, fare_type, available_seats } = req.body;
        
        const [result] = await db.execute(
            `INSERT INTO flights (airline, flight_number, origin_code, origin_name, destination_code, destination_name, departure_date, departure_time, arrival_date, arrival_time, price, fare_type, available_seats) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [airline, flight_number, origin_code, origin_name, destination_code, destination_name, departure_date, departure_time, arrival_date, arrival_time, price, fare_type || 'Economy', available_seats || 100]
        );
        
        res.json({ success: true, message: 'Flight created successfully', flightId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

