const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require('../services/bookingService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

/**
 * Booking Controller
 * Handles booking management requests
 */

/**
 * Create a new booking
 * POST /api/v1/booking
 * Protected route - driver role required
 */
const createNewBooking = async (req, res, next) => {
  try {
    const { parkingId, startTime, endTime, notes } = req.validated;

    const booking = await createBooking(req.user._id, {
      parkingId,
      startTime,
      endTime,
      notes,
    });

    res.status(201).json(
      new ApiResponse(201, booking, 'Booking created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's bookings
 * GET /api/v1/booking/my-bookings
 * Protected route - driver role required
 */
const getUserBookingsList = async (req, res, next) => {
  try {
    const result = await getUserBookings(req.user._id, req.query);

    res.status(200).json(
      new ApiResponse(200, result, 'Bookings fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by ID
 * GET /api/v1/booking/:id
 * Protected route
 */
const getBooking = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id, req.user._id);

    res.status(200).json(
      new ApiResponse(200, booking, 'Booking fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel booking
 * DELETE /api/v1/booking/:id
 * Protected route
 */
const cancelUserBooking = async (req, res, next) => {
  try {
    const booking = await cancelBooking(req.params.id, req.user._id);

    res.status(200).json(
      new ApiResponse(200, booking, 'Booking cancelled successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewBooking,
  getUserBookingsList,
  getBooking,
  cancelUserBooking,
};
