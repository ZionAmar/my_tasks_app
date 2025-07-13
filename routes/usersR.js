const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM users'; 
        const [users] = await db.query(sql);
        res.json(users);

    } catch (err) {
        console.error("Error fetching users:", err);
    }
});

module.exports = router;