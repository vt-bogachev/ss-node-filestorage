class ValidationErrorBase extends Error {
  constructor (message, options) {
    super()
    this.name = 'ValidationErrorBase'
    this.message = message || 'Validation Error'
    this.options = options || {}
    Error.captureStackTrace(this, this.constructor)
  }

}

class StorageValidationErrors extends Error {

  /**
   *
   * @param {String}    message
   * @param {Object[]}  errors
   */
  constructor (message, errors) {
    super()
    this.name = 'StorageValidationErrors'
    this.message = message || 'Validation Error'
    this.errors = errors || []
    Error.captureStackTrace(this, this.constructor)
  }

}

module.exports = StorageValidationErrors
module.exports.default = StorageValidationErrors
module.exports.ValidationErrorBase = ValidationErrorBase

