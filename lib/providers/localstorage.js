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

    this.path = options.path
  }

  async put (filename, content) {
    const filePath = path.join(this.path, filename)
    return new Promise((resolve, reject) => {
      return fs.writeFile(filePath, content, (err) => {
        if (err) reject(err)
        resolve(true)
      })
    })
  }

  async get (filename) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.path, filename)
      fs.exists(filePath, (exist) => {
        if (!exist) {
          reject(new Error('FILE_NOT_FOUND'))
        }
        const content = fs.readFileSync(filePath)
        resolve(content)
      })
    })
  }

}

module.exports = LocalStorage