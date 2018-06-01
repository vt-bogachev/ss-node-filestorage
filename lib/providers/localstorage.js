const fs = require('fs'),
  path = require('path')

/**
 *
 * @param   {String}  storagePath
 */
function checkDir (storagePath) {

  if (!path.isAbsolute(storagePath)) {
    throw new Error(`LocalStorage [options.storagePath]. Should set only absolute path.`)
  }

  const list = storagePath.split(path.sep)

  list.reduce((next, value, index) => {
    next.push(value)
    if (index > 0) {
      const targetPath = next.join(path.sep)
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
      }
    }
    return next
  }, [])
}

class LocalStorage {

  /**
   *
   * @param {Object} options
   * @param {String} options.path
   */
  constructor (options) {

    if (!options) {
      throw new Error(`LocalStorage [options]. Should set options.`)
    }

    if (!options.path) {
      throw new Error(`LocalStorage [options.path]. Not found.`)
    }

    checkDir(options.path)
  }

}

module.exports = LocalStorage