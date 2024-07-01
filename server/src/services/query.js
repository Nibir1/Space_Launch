// Define default values for pagination parameters
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; // This is a common default value, you can adjust it

/**
 * This function extracts and validates pagination parameters from a query object.
 *
 * @param {Object} query - The query object containing potential pagination parameters.
 *   - query.page: (Optional) The desired page number (defaults to 1).
 *   - query.limit: (Optional) The number of items per page (defaults to DEFAULT_PAGE_LIMIT).
 *
 * @returns {Object} - An object containing the validated pagination options:
 *   - skip: The number of documents to skip based on the page and limit.
 *   - limit: The maximum number of documents to retrieve per page.
 */
function getPagination(query) {
  // Extract and handle page number
  const page = Math.abs(parseInt(query.page || DEFAULT_PAGE_NUMBER)); // Ensure positive integer

  // Extract and handle limit (consider using a minimum value as well)
  const limit = Math.abs(parseInt(query.limit || DEFAULT_PAGE_LIMIT));

  // Calculate the number of documents to skip based on page and limit
  const skip = (page - 1) * limit;

  // Return the validated pagination options
  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
