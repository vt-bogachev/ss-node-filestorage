const ValidationErrorBase = require('./validation.error').ValidationErrorBase

class StorageSizeValidationError extends ValidationErrorBase {

  constructor (message, options) {
    super(message, options)
    this.name = 'StorageSizeValidationError'
    Error.captureStackTrace(this, this.constructor)
  }

  toString () {
    return `${this.message} Content size: ${this.options.size} Limit: ${this.options.limit}`
  }

}

/**
 * Size validation.
 * @param {Buffer} content
 * @param {Object} options
 * @param {Number} [options.min]
 * @param {Number} [options.max]
 * @return {Array}
 */
function validator (content, options) {
  const minSize = options.min || null
  const maxSize = options.max || null
  const result = []

  if (minSize && content.length <= minSize) {
    result.push(new StorageSizeValidationError('VALIDATOR.SIZE.MIN', {
      size: content.length,
      limit: minSize
    }))
  }

  if (maxSize && content.length >= maxSize) {
    result.push(new StorageSizeValidationError('VALIDATOR.SIZE.MAX', {
      size: content.length,
      limit: maxSize
    }))
  }

  return result
}

module.exports = validator
module.exports.default = validator
module.exports.StorageSizeValidationError = StorageSizeValidationError