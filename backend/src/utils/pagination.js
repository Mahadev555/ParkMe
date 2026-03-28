/**
 * Pagination Helper
 * Handles pagination for list endpoints
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build paginated response
 * @param {*} items - Array of items
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} - Paginated response object
 */
const buildPaginatedResponse = (items, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    pagination: {
      current: page,
      pageSize: limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
};

module.exports = {
  getPaginationParams,
  buildPaginatedResponse,
};
