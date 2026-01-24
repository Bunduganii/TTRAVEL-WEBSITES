const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, email, full_name, user_type, phone, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, users });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
