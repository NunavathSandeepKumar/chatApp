const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/verify', authenticateToken, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = router;