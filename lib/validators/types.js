module.exports = function (content, options) {
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