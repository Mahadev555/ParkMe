const Booking = require('../models/Booking');
const Parking = require('../models/Parking');
const ApiError = require('../utils/ApiError');
const { getPaginationParams, buildPaginatedResponse } = require('../utils/pagination');
const logger = require('../utils/logger');

/**
 * Booking Service
 * Handles parking space booking operations
 */

/**
 * Create a new booking
 * @param {string} userId - User ID
 * @param {object} bookingData - Booking data
 * @returns {object} - Created booking
 * @throws {ApiError}
 */
const createBooking = async (userId, bookingData) => {
  try {
    const { parkingId, startTime, endTime, notes } = bookingData;

    // Convert strings to Date objects if needed
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Validate dates
    if (start >= end) {
      throw new ApiError(400, 'End time must be after start time');
    }

    // Allow bookings up to 1 minute ago (accounting for processing time)
    if (start < new Date(now.getTime() - 60000)) {
      throw new ApiError(400, 'Cannot book in the past');
    }

    // Check if parking exists and is active
    const parking = await Parking.findById(parkingId);

    if (!parking) {
      throw new ApiError(404, 'Parking space not found');
    }

    if (!parking.isActive) {
      throw new ApiError(400, 'Parking space is not available');
    }

    // Check for double booking
    const existingBooking = await Booking.findOne({
      parkingId,
      status: { $in: ['pending', 'booked'] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    });

    if (existingBooking) {
      throw new ApiError(400, 'Parking space is already booked for this time slot');
    }

    // Calculate total price
    const durationHours = Math.ceil((end - start) / (1000 * 60 * 60));
    const totalPrice = durationHours * parking.pricePerHour;

    // Create booking
    const booking = await Booking.create({
      userId,
      parkingId,
      startTime: start,
      endTime: end,
      totalPrice,
      notes,
      status: 'pending',
    });

    logger.info('Booking created', {
      bookingId: booking._id,
      userId,
      parkingId,
    });

    return booking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Create booking error', error.message);
    throw new ApiError(500, 'Failed to create booking');
  }
};

/**
 * Get user's bookings
 * @param {string} userId - User ID
 * @param {object} query - Query parameters
 * @returns {object} - Paginated bookings
 * @throws {ApiError}
 */
const getUserBookings = async (userId, query) => {
  try {
    const { skip, limit, page } = getPaginationParams(query);

    const [bookings, total] = await Promise.all([
      Booking.find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: 'parkingId',
          select: 'title address pricePerHour location',
        }),
      Booking.countDocuments({ userId }),
    ]);

    return buildPaginatedResponse(bookings, total, page, limit);
  } catch (error) {
    logger.error('Get user bookings error', error.message);
    throw new ApiError(500, 'Failed to fetch bookings');
  }
};

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @param {string} userId - User ID (for authorization)
 * @returns {object} - Booking details
 * @throws {ApiError}
 */
const getBookingById = async (bookingId, userId) => {
  try {
    const booking = await Booking.findById(bookingId).populate({
      path: 'parkingId userId',
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Check if user owns this booking - compare both as strings
    // Handle both populated and non-populated userId
    const bookingUserIdStr = booking.userId._id 
      ? booking.userId._id.toString() 
      : booking.userId.toString();
    const requestUserIdStr = userId.toString();

    if (bookingUserIdStr !== requestUserIdStr) {
      throw new ApiError(403, 'Not authorized to view this booking');
    }

    return booking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Get booking by ID error', error.message);
    throw new ApiError(500, 'Failed to fetch booking');
  }
};

/**
 * Cancel booking
 * @param {string} bookingId - Booking ID
 * @param {string} userId - User ID (for authorization)
 * @returns {object} - Updated booking
 * @throws {ApiError}
 */
const cancelBooking = async (bookingId, userId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Handle both populated and non-populated userId
    // If populated (object with _id), get the _id. Otherwise use directly.
    const bookingUserIdStr = booking.userId._id 
      ? booking.userId._id.toString() 
      : booking.userId.toString();
    const requestUserIdStr = userId.toString();

    logger.debug('Cancel booking authorization check', {
      bookingUserId: bookingUserIdStr,
      requestUserId: requestUserIdStr,
      match: bookingUserIdStr === requestUserIdStr,
    });

    if (bookingUserIdStr !== requestUserIdStr) {
      throw new ApiError(403, 'Not authorized to cancel this booking');
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      throw new ApiError(400, `Cannot cancel a ${booking.status} booking`);
    }

    // If paid, mark as refunded
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    booking.status = 'cancelled';
    await booking.save();

    logger.info('Booking cancelled', {
      bookingId,
      userId,
    });

    return booking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Cancel booking error', error.message);
    throw new ApiError(500, 'Failed to cancel booking');
  }
};

/**
 * Update booking status (admin/owner only)
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {object} - Updated booking
 * @throws {ApiError}
 */
const updateBookingStatus = async (bookingId, status) => {
  try {
    const validStatuses = ['pending', 'booked', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    logger.info('Booking status updated', {
      bookingId,
      status,
    });

    return booking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Update booking status error', error.message);
    throw new ApiError(500, 'Failed to update booking status');
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
};
