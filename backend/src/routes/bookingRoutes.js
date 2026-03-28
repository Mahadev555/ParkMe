const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validate } = require('../utils/validation');
const {
  createNewBooking,
  getUserBookingsList,
  getBooking,
  cancelUserBooking,
} = require('../controllers/bookingController');

const router = express.Router();

/**
 * Booking Routes
 */

// POST /api/v1/booking - Create new booking (driver only)
router.post(
  '/',
  auth,
  authorize('driver'),
  validate('createBooking'),
  createNewBooking
);

// GET /api/v1/booking/my-bookings - Get user's bookings
router.get(
  '/my-bookings',
  auth,
  authorize('driver'),
  getUserBookingsList
);

// GET /api/v1/booking/:id - Get booking by ID
router.get(
  '/:id',
  auth,
  getBooking
);

// DELETE /api/v1/booking/:id - Cancel booking
router.delete(
  '/:id',
  auth,
  cancelUserBooking
);

module.exports = router;
