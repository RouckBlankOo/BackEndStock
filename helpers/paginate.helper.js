/**
 * Build pagination and sorting options
 * @param {number|string} page - Current page (1-based)
 * @param {number|string} size - Page size (items per page)
 * @param {string} [order='desc'] - 'asc' or 'desc'
 * @param {string} [sortBy='date'] - Field to sort by
 * @returns {Object} { skip, limit, page, size, sort }
 */
function paginate(page = 1, size = 10, order = 'desc', sortBy = 'createdAt') {
  const parsedPage = Math.max(parseInt(page), 1);
  const parsedSize = Math.max(parseInt(size), 1);
  const skip = (parsedPage - 1) * parsedSize;

  const sort = {
    [sortBy]: order === 'asc' ? 1 : -1,
  };

  return {
    skip,
    limit: parsedSize,
    page: parsedPage,
    size: parsedSize,
    sort,
  };
}

module.exports = {
  paginate,
};

