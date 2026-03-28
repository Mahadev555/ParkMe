const express = require('express');
const auth = require('../middleware/auth');
const { validate } = require('../utils/validation');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');

const router = express.Router();

/**
 * Authentication Routes
 */

// POST /api/v1/auth/register
router.post('/register', validate('register'), registerUser);

// POST /api/v1/auth/login
router.post('/login', validate('login'), loginUser);

// GET /api/v1/auth/profile
router.get('/profile', auth, getUserProfile);

module.exports = router;
