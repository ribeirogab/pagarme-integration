
const HTTP_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

class HttpError extends Error {
  /**
   * An exception for HTTP Errors
   * @param {String} message Error message
   * @param {Object} [options] Error options
   * @param {String} [options.code] Error code
   * @param {('BAD_REQUEST' | 'FORBIDDEN' | 'UNAUTHORIZED' | 'INTERNAL_ERROR' | 'NOT_FOUND')} [options.status] HTTP status code
   */
  constructor(message, options = {}) {
    super()
    this.message = message
    this.code = options.code || 'ERR_INTERNAL'
    this.statusCode =
      HTTP_ERROR_CODES[options.status] || HTTP_ERROR_CODES.INTERNAL_ERROR
  }
}

module.exports = {
  HttpError,
}