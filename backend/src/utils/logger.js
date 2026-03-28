/**
 * Logger Utility
 * Provides consistent logging throughout the application
 */
const logLevels = {
  error: 'ERROR',
  warn: 'WARN',
  info: 'INFO',
  debug: 'DEBUG',
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 */
const formatLog = (level, message, data = '') => {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
};

const logger = {
  error: (message, data) => console.error(formatLog(logLevels.error, message, data)),
  warn: (message, data) => console.warn(formatLog(logLevels.warn, message, data)),
  info: (message, data) => console.log(formatLog(logLevels.info, message, data)),
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatLog(logLevels.debug, message, data));
    }
  },
};

module.exports = logger;
