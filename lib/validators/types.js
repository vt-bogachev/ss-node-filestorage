const ValidationErrorBase = require('./validation.error').ValidationErrorBase

class StorageTypeValidationError extends ValidationErrorBase {

  /**
   * @param {String} message
   * @param {Object} options
   * @param {String} options.type
   * @param {String[]} options.types
   */
  constructor (message, options) {
    super(message, options)
    this.name = 'StorageTypeValidationError'
    Error.captureStackTrace(this, this.constructor)
  }

  toString () {
    return `${this.message} Content type: ${this.options.type} Available types: ${this.options.types}`
  }

}

/**
 * @param {Object} content
 * @param {String[]} options
 * @return {Array}
 */
function validator (content, options) {
  const {ext, mime} = content
  const result = []

  if (options.indexOf(ext) === -1) {
    result.push(new StorageTypeValidationError('VALIDATOR.TYPE', {
      type: ext,
      types: options
    }))
  }

  return result
}

module.exports = validator
module.exports.default = validator
module.exports.StorageTypeValidationError = StorageTypeValidationError