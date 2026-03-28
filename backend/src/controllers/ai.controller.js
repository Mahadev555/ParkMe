/**
 * AI Controller - Handles AI-related HTTP requests
 * Processes parking search queries using the search agent
 */

const { parseSearchQuery } = require("../ai/searchAgent");
const Parking = require("../models/Parking");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * POST /api/ai/search
 * Convert natural language query to structured parking search filter
 *
 * Request Body:
 * {
 *   "query": "Find parking near Baner under 50 rupees for 2 hours"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "location": "Baner",
 *     "maxPrice": 50,
 *     "duration": 2,
 *     "time": null
 *   },
 *   "message": "Query parsed successfully"
 * }
 */
async function searchWithAI(req, res, next) {
  try {
    // Extract and validate query from request body
    const { query } = req.body;

    if (!query) {
      logger.warn("[AI Controller] Search query missing from request");
      throw new ApiError(400, "Query is required");
    }

    if (typeof query !== "string") {
      logger.warn("[AI Controller] Search query is not a string");
      throw new ApiError(400, "Query must be a string");
    }

    if (query.trim().length === 0) {
      logger.warn("[AI Controller] Search query is empty");
      throw new ApiError(400, "Query cannot be empty");
    }

    logger.info(`[AI Controller] Processing search query: "${query.substring(0, 50)}..."`);

    // Call search agent to parse query
    const searchFilter = await parseSearchQuery(query);

    logger.info(`[AI Controller] Query parsed successfully:`, searchFilter);

    // Build MongoDB query to fetch parkings
    let mongoQuery = { isActive: true };

    // Add price filter if provided
    if (searchFilter.maxPrice) {
      mongoQuery.pricePerHour = { $lte: searchFilter.maxPrice };
    }

    // Add location filter if provided (search in address)
    if (searchFilter.location) {
      mongoQuery.address = { $regex: searchFilter.location, $options: "i" };
    }

    // Check if any filters were applied
    const hasFilters = searchFilter.location || searchFilter.maxPrice || searchFilter.duration || searchFilter.time;

    // Fetch parkings from database
    let parkings;
    if (hasFilters) {
      // If filters exist, apply them and fetch up to 10 results
      parkings = await Parking.find(mongoQuery)
        .select("_id title address pricePerHour ratings spacesAvailable")
        .limit(10)
        .lean();
    } else {
      // If no filters, return top 2 rated parkings
      parkings = await Parking.find(mongoQuery)
        .select("_id title address pricePerHour ratings spacesAvailable")
        .sort({ "ratings.average": -1 })
        .limit(2)
        .lean();
    }

    logger.info(`[AI Controller] Found ${parkings.length} parkings`);

    // Return success response with both filter and parkings
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          filters: searchFilter,
          parkings: parkings,
          count: parkings.length,
          hasFilters: hasFilters,
        },
        "Search completed successfully"
      )
    );
  } catch (error) {
    logger.error(`[AI Controller] Error in searchWithAI:`, {
      message: error.message,
      status: error.status,
    });

    // Pass error to error handler middleware
    next(error);
  }
}

module.exports = {
  searchWithAI,
};
