const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { register, login } = require('../controllers/authController');

// 🔐 Rate limit SOLO para login
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de login, intentá más tarde'
});

// 📌 Auth routes
router.post('/register', register);
router.post('/login', loginLimiter, login);

module.exports = router;
