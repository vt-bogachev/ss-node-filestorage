module.exports = function (content, options) {
  const minSize = options.min || null
  const maxSize = options.max || null
  const data = Buffer.from(content)
  const result = []

  if (minSize && data.length <= minSize) {
    result.push({message: 'VALIDATOR.SIZE.MIN', size: data.length, min: minSize})
  }

  if (maxSize && data.length >= maxSize) {
    result.push({message: 'VALIDATOR.SIZE.MAX', size: data.length, min: maxSize})
  }

  return result
}