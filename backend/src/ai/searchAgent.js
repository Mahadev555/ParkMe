/**
 * Search Agent - Converts natural language parking queries to structured filters
 * Uses Gemini API to intelligently parse user input
 */

const aiService = require("./ai.service");
const { buildSearchPrompt } = require("./searchPrompt");
const logger = require("../utils/logger");

/**
 * Parse natural language query into structured parking search filter
 * @param {string} userQuery - Natural language parking query
 * @returns {Promise<Object>} - Structured search filter with location, maxPrice, duration, time
 */
async function parseSearchQuery(userQuery) {
  // Input validation
  if (!userQuery || typeof userQuery !== "string") {
    logger.warn("[Search Agent] Invalid query received:", userQuery);
    return getFallbackResponse();
  }

  try {
    logger.info(`[Search Agent] Processing query: "${userQuery}"`);

    // Build the complete prompt with user query
    const fullPrompt = buildSearchPrompt(userQuery);

    // Call Gemini API to generate response
    const rawResponse = await aiService.generateContent(fullPrompt);

    // Parse and validate response
    const parsedFilter = parseGeminiResponse(rawResponse);

    logger.info(`[Search Agent] Successfully parsed query:`, parsedFilter);

    return parsedFilter;
  } catch (error) {
    logger.error(`[Search Agent] Error parsing query:`, {
      message: error.message,
      query: userQuery,
    });

    // Return fallback response on error
    return getFallbackResponse();
  }
}

/**
 * Parse and clean Gemini API response
 * Handles JSON extraction and validation
 * @param {string} rawResponse - Raw response from Gemini API
 * @returns {Object} - Parsed filter object or fallback
 */
function parseGeminiResponse(rawResponse) {
  try {
    // Clean response: remove markdown code blocks if present
    let cleanedResponse = rawResponse.trim();

    // Remove ```json``` and ``` if present
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");

    logger.debug(`[Search Agent] Cleaned response: ${cleanedResponse}`);

    // Parse JSON
    const parsed = JSON.parse(cleanedResponse);

    // Validate structure - ensure all required fields exist
    const validated = validateParsedFilter(parsed);

    return validated;
  } catch (error) {
    logger.error(`[Search Agent] JSON parsing error:`, {
      message: error.message,
      rawResponse: rawResponse.substring(0, 200), // Log first 200 chars
    });

    return getFallbackResponse();
  }
}

/**
 * Validate parsed filter object structure
 * Ensures all required fields exist with correct types
 * @param {Object} filter - Parsed filter object
 * @returns {Object} - Validated filter with all fields
 */
function validateParsedFilter(filter) {
  return {
    location: filter.location || null,
    maxPrice:
      typeof filter.maxPrice === "number" ? filter.maxPrice : null,
    duration:
      typeof filter.duration === "number" ? filter.duration : null,
    time: filter.time || null,
  };
}

/**
 * Fallback response when parsing fails
 * Returns all fields as null
 * @returns {Object} - Fallback filter
 */
function getFallbackResponse() {
  return {
    location: null,
    maxPrice: null,
    duration: null,
    time: null,
  };
}

module.exports = {
  parseSearchQuery,
  validateParsedFilter,
};
