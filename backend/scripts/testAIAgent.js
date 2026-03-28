/**
 * AI Agent Test Suite
 * Test the search agent with various queries
 * Run with: node scripts/testAIAgent.js
 */

require('dotenv').config({ path: './.env' });

const axios = require('axios');

// Test configuration
const API_URL = process.env.API_URL || 'http://localhost:5000/api/v1';
const TIMEOUT = 15000; // 15 seconds

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Test cases
const testCases = [
  {
    name: 'Complete Query',
    query: 'Find parking near Baner under 50 rupees for 2 hours',
    expected: { location: 'Baner', maxPrice: 50, duration: 2, time: null },
  },
  {
    name: 'Evening Parking at Airport',
    query: 'I need evening parking at the airport',
    expected: { location: 'airport', maxPrice: null, duration: null, time: 'evening' },
  },
  {
    name: 'Price-Focused Query',
    query: 'Cheapest parking, max 100 rupees per hour',
    expected: { location: null, maxPrice: 100, duration: null, time: null },
  },
  {
    name: 'Duration-Based',
    query: 'I need parking for 3 hours',
    expected: { location: null, maxPrice: null, duration: 3, time: null },
  },
  {
    name: 'Morning Parking Downtown',
    query: 'Morning parking near downtown area, under 60 rupees',
    expected: { location: 'downtown', maxPrice: 60, duration: null, time: 'morning' },
  },
  {
    name: 'Vague Query',
    query: 'Where can I park my car?',
    expected: { location: null, maxPrice: null, duration: null, time: null },
  },
];

/**
 * Test AI search endpoint
 */
async function testAISearch() {
  console.log('\n');
  console.log(colors.bright + colors.cyan + '═════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bright + colors.cyan + `        ParkMe AI Search Agent Test Suite` + colors.reset);
  console.log(colors.bright + colors.cyan + '═════════════════════════════════════════════════════' + colors.reset);
  console.log(`\nAPI URL: ${colors.yellow}${API_URL}/ai/search${colors.reset}\n`);

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    try {
      console.log(colors.bright + `Test: ${testCase.name}` + colors.reset);
      console.log(`Query: "${testCase.query}"`);

      // Make API request
      const response = await axios.post(`${API_URL}/ai/search`, { query: testCase.query }, { timeout: TIMEOUT });

      const data = response.data.data;

      console.log(`Response:`, JSON.stringify(data, null, 2));

      // Validate response structure
      const hasAllFields = 
        data.hasOwnProperty('location') &&
        data.hasOwnProperty('maxPrice') &&
        data.hasOwnProperty('duration') &&
        data.hasOwnProperty('time');

      if (!hasAllFields) {
        console.log(colors.red + '  ✗ FAIL: Missing required fields' + colors.reset);
        failedTests++;
        console.log('');
        continue;
      }

      // Validate JSON structure
      const isValidJSON = typeof data === 'object' && data !== null;
      if (!isValidJSON) {
        console.log(colors.red + '  ✗ FAIL: Invalid JSON structure' + colors.reset);
        failedTests++;
        console.log('');
        continue;
      }

      console.log(colors.green + '  ✓ PASS: Valid JSON response with all fields' + colors.reset);
      passedTests++;
    } catch (error) {
      console.log(colors.red + `  ✗ FAIL: ${error.message}` + colors.reset);
      if (error.response?.data) {
        console.log(`  Error Details:`, error.response.data);
      }
      failedTests++;
    }

    console.log('');
  }

  // Summary
  console.log(colors.bright + colors.cyan + '═════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bright + `Test Summary` + colors.reset);
  console.log(colors.bright + colors.cyan + '═════════════════════════════════════════════════════' + colors.reset);
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log('');

  if (failedTests === 0 && passedTests > 0) {
    console.log(colors.bright + colors.green + '🎉 All tests passed! AI Agent is working correctly.' + colors.reset);
  } else if (failedTests > 0) {
    console.log(colors.bright + colors.red + `❌ ${failedTests} test(s) failed. Check logs above.` + colors.reset);
  }

  console.log('\n');
}

/**
 * Test individual endpoint with custom query
 */
async function testCustomQuery(query) {
  console.log(`\n${colors.bright}Testing custom query:${colors.reset}`);
  console.log(`Query: "${query}"\n`);

  try {
    const response = await axios.post(`${API_URL}/ai/search`, { query }, { timeout: TIMEOUT });
    console.log(colors.green + 'Response:' + colors.reset);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log(colors.red + 'Error:' + colors.reset);
    console.log(error.message);
    if (error.response?.data) {
      console.log('Details:', error.response.data);
    }
  }
}

/**
 * Main test runner
 */
async function main() {
  // Check if custom query provided via command line
  const customQuery = process.argv[2];

  if (customQuery) {
    await testCustomQuery(customQuery);
  } else {
    await testAISearch();
  }
}

// Run tests
main().catch(console.error);
