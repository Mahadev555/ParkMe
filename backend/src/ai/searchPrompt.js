/**
 * Search Prompt Template for Parking Query Parser
 * Instructs the AI agent on how to parse natural language parking queries
 */

const SYSTEM_INSTRUCTION = `You are a parking search query parser. Extract specific parking criteria from queries. Return JSON with keys: location, maxPrice, duration, time. Only include location if it's a SPECIFIC place name (city, area, landmark). Return null for vague terms like "near me", "here", "nearby". All other values null if not mentioned. Output ONLY valid JSON, nothing else.`;

const SEARCH_PROMPT_TEMPLATE = `Parse into JSON: location (string|null - only specific place names), maxPrice (number|null), duration (number|null - hours), time (string|null - morning/afternoon/evening/night). Return ONLY valid JSON.`;

/**
 * Build the complete prompt with user query
 * @param {string} userQuery - The user's natural language query
 * @returns {string} - Complete prompt with query appended
 */
function buildSearchPrompt(userQuery) {
  return SEARCH_PROMPT_TEMPLATE + "\n\nQuery: " + userQuery;
}

module.exports = {
  SYSTEM_INSTRUCTION,
  SEARCH_PROMPT_TEMPLATE,
  buildSearchPrompt,
};
