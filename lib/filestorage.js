const fileType = require('file-type')

const container = require('./container')

const Validators = require('./validators')
const LocalStorage = require('./providers/localstorage')

class FileStorage {
  constructor (provider, options) {
    this.provider = provider
    this.options = options || {}
  }

  /**
   * Init new storage.
   * @param {String}        name            Name of storage.
   * @param {LocalStorage}  provider        Provider to storage.
   * @param {Object}        [options]       Storage options:
   * @param {String}        [options.url]   Base url for content.
   * @param {Object}        [options.validators]   Validators
   * @param {Object}        [options.validators.size]   Size validator:
   * @param {Number}        [options.validators.size.min]   Min size
   * @param {Number}        [options.validators.size.max]   Max size
   */
  static init (name, provider, options) {
    const fileStorage = new FileStorage()
    fileStorage.provider = provider
    fileStorage.options = options || {}
    container.add(name, fileStorage)
  }

  static exists (name) {
    return container.exists(name)
  }

  static use (name) {
    return container.use(name)
  }

  async put (filename, content) {
    const data = Buffer.from(content)
    const ft = fileType(data)

    if (this.options && this.options.validators) {
      let validation = []
      if (this.options.validators.size) {
        validation = [...Validators.Size(data, this.options.validators.size)]
      }
      if (this.options.validators.types) {
        validation = [...validation, ...Validators.Types(ft, this.options.validators.types)]
      }
      if (validation.length > 0) {
        return Promise.reject(validation)
      }
    }

    return this.provider.put(filename, data, ft)
  }

  async get (filename) {
    return this.provider.get(filename).then((data) => {
      const ft = fileType(data)
      if (!ft)
        return data.toString()
    })
  }

  async getUrl (filename) {
    return this.provider.getUrl(filename).
      then((providerUrl) => [this.options.url, providerUrl].join('/'))
  }

  async remove (filename) {
    return this.provider.remove(filename)
  }
}

module.exports = FileStorage
module.exports.default = FileStorage
module.exports.LocalStorage = LocalStorage
module.exports.Validators = Validators