const Parking = require('../models/Parking');
const ApiError = require('../utils/ApiError');
const { getPaginationParams, buildPaginatedResponse } = require('../utils/pagination');
const logger = require('../utils/logger');

/**
 * Search Service
 * Handles parking space search with geolocation and filters
 */

/**
 * Search parking spaces by location and filters
 * Uses MongoDB geospatial queries for efficient location-based search
 * @param {object} searchParams - Search parameters
 * @returns {object} - Paginated search results
 * @throws {ApiError}
 */
const searchParking = async (searchParams) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5000, // Default 5km
      maxPrice,
      minPrice,
      page,
      limit,
    } = searchParams;

    const { skip, limit: paginationLimit, page: currentPage } = getPaginationParams({
      page,
      limit,
    });

    logger.debug('Searching parking', {
      latitude,
      longitude,
      radius,
      filters: { minPrice, maxPrice },
    });

    // Build aggregation pipeline for geospatial search
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: radius, // in meters
          spherical: true,
        },
      },
      {
        $match: {
          isActive: true,
        },
      },
    ];

    // Add price filters if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceMatch = {};
      if (minPrice !== undefined) {
        priceMatch.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        priceMatch.$lte = maxPrice;
      }
      pipeline.push({
        $match: {
          pricePerHour: priceMatch,
        },
      });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { 'ratings.average': -1, distance: 1 } },
      { $skip: skip },
      { $limit: paginationLimit },
      {
        $project: {
          title: 1,
          description: 1,
          address: 1,
          location: 1,
          pricePerHour: 1,
          ratings: 1,
          isActive: 1,
          distance: 1,
        },
      }
    );

    // Execute aggregation pipeline
    const parkings = await Parking.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: radius,
          spherical: true,
        },
      },
      {
        $match: {
          isActive: true,
        },
      },
    ];

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceMatch = {};
      if (minPrice !== undefined) {
        priceMatch.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        priceMatch.$lte = maxPrice;
      }
      countPipeline.push({
        $match: {
          pricePerHour: priceMatch,
        },
      });
    }

    countPipeline.push({ $count: 'total' });
    const countResult = await Parking.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return buildPaginatedResponse(parkings, total, currentPage, paginationLimit);
  } catch (error) {
    logger.error('Search parking error', error.message);
    throw new ApiError(500, 'Failed to search parking spaces');
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} - Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Get trending parking spaces
 * @param {number} limit - Number of results to return
 * @returns {array} - Top-rated parking spaces
 * @throws {ApiError}
 */
const getTrendingParking = async (limit = 10) => {
  try {
    const parkings = await Parking.find({ isActive: true })
      .sort({ 'ratings.average': -1, 'ratings.count': -1 })
      .limit(limit)
      .select('title address pricePerHour ratings');

    return parkings;
  } catch (error) {
    logger.error('Get trending parking error', error.message);
    throw new ApiError(500, 'Failed to fetch trending parking spaces');
  }
};

module.exports = {
  searchParking,
  getTrendingParking,
  calculateDistance,
};
