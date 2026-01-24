// ============================================
// Package Routes
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ============================================
// Get All Packages
// ============================================
router.get('/', async (req, res) => {
    try {
        const { tripType, minPrice, maxPrice, duration } = req.query;
        
        let query = 'SELECT * FROM packages WHERE 1=1';
        const params = [];
        
        if (tripType) {
            query += ' AND trip_type = ?';
            params.push(tripType);
        }
        
        if (minPrice) {
            query += ' AND discounted_price >= ?';
            params.push(minPrice);
        }
        
        if (maxPrice) {
            query += ' AND discounted_price <= ?';
            params.push(maxPrice);
        }
        
        if (duration) {
            if (duration === '4-7') {
                query += ' AND duration_days BETWEEN 4 AND 7';
            } else if (duration === '8-14') {
                query += ' AND duration_days BETWEEN 8 AND 14';
            } else if (duration === '15+') {
                query += ' AND duration_days >= 15';
            }
        }
        
        const [packages] = await db.execute(query, params);
        
        res.json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Get Package by ID
// ============================================
router.get('/:id', async (req, res) => {
    try {
        const [packages] = await db.execute('SELECT * FROM packages WHERE id = ?', [req.params.id]);
        
        if (packages.length === 0) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        
        res.json({ success: true, package: packages[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// Create Package (Admin)
// ============================================
router.post('/', async (req, res) => {
    try {
        const { title, destination, trip_type, duration_days, original_price, discounted_price, description, inclusions, image_url, rating, city, country } = req.body;
        
        // Extract city and country from destination if not provided
        let packageCity = city;
        let packageCountry = country;
        
        if (!packageCity || !packageCountry) {
            // Try to parse from destination (e.g., "Santorini, Greece")
            const parts = (destination || '').split(',').map(s => s.trim());
            if (parts.length >= 2) {
                packageCity = packageCity || parts[0];
                packageCountry = packageCountry || parts[1];
            } else if (parts.length === 1) {
                packageCity = packageCity || parts[0];
                packageCountry = packageCountry || 'Unknown';
            } else {
                packageCity = packageCity || 'Unknown';
                packageCountry = packageCountry || 'Unknown';
            }
        }
        
        const duration_nights = Math.max(0, (duration_days || 7) - 1);
        
        const [result] = await db.execute(
            `INSERT INTO packages (title, destination, city, country, trip_type, duration_days, duration_nights, original_price, discounted_price, description, inclusions, image_url, rating) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, destination, packageCity, packageCountry, trip_type || 'Adventure', duration_days, duration_nights, original_price, discounted_price, description || '', inclusions || '', image_url || '', rating || 4.5]
        );
        
        res.json({ success: true, message: 'Package created successfully', packageId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

