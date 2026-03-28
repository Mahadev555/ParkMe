/**
 * AI Service - Handles communication with Google Gemini API
 * Uses the official @google/genai SDK for content generation
 */

const { GoogleGenAI } = require("@google/genai");
const { SYSTEM_INSTRUCTION } = require("./searchPrompt");
const logger = require("../utils/logger");

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3-flash-preview";

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Initialize GoogleGenAI client
let ai = null;
function getAIClient() {
  if (!ai) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured in environment variables");
    }
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });
  }
  return ai;
}

/**
 * Generate content using Google Gemini API with system instructions
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The content response from Gemini
 * @throws {Error} - If API call fails after retries
 */
async function generateContent(prompt, retryCount = 0) {
  try {
    logger.info(`[AI Service] Sending prompt to Gemini API (Attempt ${retryCount + 1})`);

    const ai = getAIClient();
    
    // Build request config with system instruction
    const config = {
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.1, // Very low temperature for deterministic JSON output
        maxOutputTokens: 256, // Short responses for JSON
      },
    };

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: MODEL,
      config,
      contents,
    });

    console.log("Raw Gemini API response:", response);

    // Extract content from response - SDK returns candidates array
    let content = "";
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content?.parts && candidate.content.parts.length > 0) {
        content = candidate.content.parts
          .map((part) => part.text || "")
          .join("")
          .trim();
      }
    }

    if (!content) {
      throw new Error("No content received from Gemini API");
    }

    logger.info(`[AI Service] Successfully received response from Gemini`);
    logger.debug(`[AI Service] Raw response: ${content}`);

    return content;
  } catch (error) {
    logger.error(`[AI Service] Gemini API Error (Attempt ${retryCount + 1}):`, {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    // Retry logic
    if (retryCount < MAX_RETRIES - 1) {
      logger.info(`[AI Service] Retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return generateContent(prompt, retryCount + 1);
    }

    throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${error.message}`);
  }
}

module.exports = {
  generateContent,
};
