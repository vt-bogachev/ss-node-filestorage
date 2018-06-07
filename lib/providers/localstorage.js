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
        if (err) return reject(err)
        return resolve(true)
      })
    })
  }

  async get (filename) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.path, filename)
      fs.exists(filePath, (exist) => {
        if (!exist) {
          return reject(new Error('FILE_NOT_FOUND'))
        }
        const content = fs.readFileSync(filePath)
        return resolve(content)
      })
    })
  }

  /**
   *
   * @param {String} filename
   * @param {Object} [options]
   * @param {Boolean} [options.rejectIfFalse=false]
   * @return {Promise<any>}
   */
  async has (filename, options) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.path, filename)
      fs.exists(filePath, (exist) => {
        if (!exist) {
          if (options && options.rejectIfFalse) {
            return reject(false)
          } else {
            return resolve(false)
          }
        }
        return resolve(true)
      })
    })
  }

  async getUrl (filename) {
    return this.has(filename, {rejectIfFalse: true}).
      then(() => filename)
  }

  async remove (filename) {
    const filePath = path.join(this.path, filename)
    return new Promise((resolve) => {
      fs.unlink(filePath, (err) => {
        if (err) resolve(false)
        resolve(true)
      })
    })
  }

}

module.exports = LocalStorage