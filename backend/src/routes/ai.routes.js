/**
 * AI Routes - API endpoints for AI agent functionality
 * Currently includes: Parking search query parser
 */

const express = require("express");
const router = express.Router();
const { searchWithAI } = require("../controllers/ai.controller");

/**
 * POST /api/ai/search
 * Parse natural language parking search query
 * Body: { "query": "string" }
 * Response: { location, maxPrice, duration, time }
 */
router.post("/search", searchWithAI);

module.exports = router;
