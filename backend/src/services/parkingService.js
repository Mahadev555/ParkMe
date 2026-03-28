const Parking = require('../models/Parking');
const ApiError = require('../utils/ApiError');
const { getPaginationParams, buildPaginatedResponse } = require('../utils/pagination');
const logger = require('../utils/logger');

/**
 * Parking Service
 * Handles parking space management operations
 */

/**
 * Create a new parking space
 * @param {string} ownerId - Owner user ID
 * @param {object} parkingData - Parking space data
 * @returns {object} - Created parking space
 * @throws {ApiError}
 */
const createParking = async (ownerId, parkingData) => {
  try {
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      pricePerHour,
      spacesAvailable = 1,
      availability = [],
    } = parkingData;

    const parking = await Parking.create({
      ownerId,
      title,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      pricePerHour,
      spacesAvailable,
      availability,
    });

    logger.info('Parking space created', {
      parkingId: parking._id,
      ownerId,
    });

    return parking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Create parking error', error.message);
    throw new ApiError(500, 'Failed to create parking space');
  }
};

/**
 * Get all parking spaces by owner
 * @param {string} ownerId - Owner user ID
 * @param {object} query - Query parameters (page, limit)
 * @returns {object} - Paginated parking spaces
 * @throws {ApiError}
 */
const getParkingByOwner = async (ownerId, query) => {
  try {
    const { skip, limit, page } = getPaginationParams(query);

    const [parkings, total] = await Promise.all([
      Parking.find({ ownerId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Parking.countDocuments({ ownerId }),
    ]);

    return buildPaginatedResponse(parkings, total, page, limit);
  } catch (error) {
    logger.error('Get parking by owner error', error.message);
    throw new ApiError(500, 'Failed to fetch parking spaces');
  }
};

/**
 * Get parking space by ID
 * @param {string} parkingId - Parking space ID
 * @returns {object} - Parking space details
 * @throws {ApiError}
 */
const getParkingById = async (parkingId) => {
  try {
    const parking = await Parking.findById(parkingId);

    if (!parking) {
      throw new ApiError(404, 'Parking space not found');
    }

    return parking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Get parking by ID error', error.message);
    throw new ApiError(500, 'Failed to fetch parking space');
  }
};

/**
 * Update parking space
 * @param {string} parkingId - Parking space ID
 * @param {string} ownerId - Owner user ID (for authorization)
 * @param {object} updateData - Data to update
 * @returns {object} - Updated parking space
 * @throws {ApiError}
 */
const updateParking = async (parkingId, ownerId, updateData) => {
  try {
    const parking = await Parking.findById(parkingId);

    if (!parking) {
      throw new ApiError(404, 'Parking space not found');
    }

    // Check ownership
    if (parking.ownerId.toString() !== ownerId) {
      throw new ApiError(403, 'Not authorized to update this parking space');
    }

    // Update allowed fields
    const allowedFields = [
      'title',
      'description',
      'address',
      'pricePerHour',
      'spacesAvailable',
      'isActive',
      'availability',
    ];

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        parking[key] = updateData[key];
      }
    });

    // Update location if latitude and longitude provided
    if (updateData.latitude && updateData.longitude) {
      parking.location.coordinates = [updateData.longitude, updateData.latitude];
    }

    const updatedParking = await parking.save();

    logger.info('Parking space updated', {
      parkingId: updatedParking._id,
      ownerId,
    });

    return updatedParking;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Update parking error', error.message);
    throw new ApiError(500, 'Failed to update parking space');
  }
};

/**
 * Delete parking space
 * @param {string} parkingId - Parking space ID
 * @param {string} ownerId - Owner user ID (for authorization)
 * @throws {ApiError}
 */
const deleteParking = async (parkingId, ownerId) => {
  try {
    const parking = await Parking.findById(parkingId);

    if (!parking) {
      throw new ApiError(404, 'Parking space not found');
    }

    // Check ownership
    if (parking.ownerId.toString() !== ownerId) {
      throw new ApiError(403, 'Not authorized to delete this parking space');
    }

    await Parking.findByIdAndDelete(parkingId);

    logger.info('Parking space deleted', {
      parkingId,
      ownerId,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Delete parking error', error.message);
    throw new ApiError(500, 'Failed to delete parking space');
  }
};

module.exports = {
  createParking,
  getParkingByOwner,
  getParkingById,
  updateParking,
  deleteParking,
};
