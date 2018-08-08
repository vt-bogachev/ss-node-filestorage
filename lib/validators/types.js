const ValidationErrorBase = require('./validation.error').ValidationErrorBase

class StorageTypeValidationError extends ValidationErrorBase {

  constructor (message, options) {
    super(message, options)
    this.name = 'StorageTypeValidationError'
    Error.captureStackTrace(this, this.constructor)
  }

  toString () {
    return `${this.message} Content size: ${this.options.size} Limit: ${this.options.limit}`
  }

}

function validator (content, options) {
  const {ext, mime} = content

  if (options.indexOf(ext) === -1) {

  }

  // const minSize = options.min || null
  // const maxSize = options.max || null
  // const result = []
  //
  // if (minSize && content.length <= minSize) {
  //   result.push({message: 'VALIDATOR.SIZE.MIN', size: content.length, min: minSize})
  // }
  //
  // if (maxSize && content.length >= maxSize) {
  //   result.push({message: 'VALIDATOR.SIZE.MAX', size: content.length, max: maxSize})
  // }

  return []
}

module.exports = validator
module.exports.default = validator
module.exports.StorageTypeValidationError = StorageTypeValidationError