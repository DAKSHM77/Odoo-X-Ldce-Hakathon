const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName', 'First name is required').not().isEmpty().trim(),
    body('lastName', 'Last name is required').not().isEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validateRequest,
  registerUser
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists(),
  ],
  validateRequest,
  loginUser
);

// POST /api/auth/logout
router.post('/logout', protect, logoutUser);

// GET /api/auth/me
router.get('/me', protect, getUserProfile);

module.exports = router;
