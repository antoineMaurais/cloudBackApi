const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM personne', (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json({ personnes: results });
    });
});

module.exports = router;
