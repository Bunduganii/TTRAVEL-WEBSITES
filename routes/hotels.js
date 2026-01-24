// ============================================
// Hotel Routes
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ============================================
// Search Hotels
// ============================================
router.get('/search', async (req, res) => {
    try {
        const { location, city, checkIn, checkOut, guests, minPrice, maxPrice, starRating } = req.query;
        
        let query = 'SELECT * FROM hotels WHERE 1=1';
        const params = [];
        
        if (city) {
            query += ' AND city LIKE ?';
            params.push(`%${city}%`);
        }
        
        if (location) {
            query += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }
        
        if (minPrice) {
            query += ' AND price_per_night >= ?';
            params.push(minPrice);
        }
        
        if (maxPrice) {
            query += ' AND price_per_night <= ?';
            params.push(maxPrice);
        }
        
        if (starRating) {
            query += ' AND star_rating = ?';
            params.push(starRating);
        }
        
        const [hotels] = await db.execute(query, params);
        
        res.json({ success: true, hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get All Hotels
// ============================================
router.get('/', async (req, res) => {
    try {
        const [hotels] = await db.execute('SELECT * FROM hotels ORDER BY name');
        res.json({ success: true, hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get Hotel by ID
// ============================================
router.get('/:id', async (req, res) => {
    try {
        const [hotels] = await db.execute('SELECT * FROM hotels WHERE id = ?', [req.params.id]);
        
        if (hotels.length === 0) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        
        res.json({ success: true, hotel: hotels[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Create Hotel (Admin)
// ============================================
router.post('/', async (req, res) => {
    try {
        const { name, location, city, country, star_rating, price_per_night, amenities, description, image_url } = req.body;
        
        const [result] = await db.execute(
            `INSERT INTO hotels (name, location, city, country, star_rating, price_per_night, amenities, description, image_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, location, city, country, star_rating, price_per_night, amenities || '', description || '', image_url || '']
        );
        
        res.json({ success: true, message: 'Hotel created successfully', hotelId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

