const container = require('./container')

const LocalStorage = require('./providers/localstorage')

class FileStorage {
  constructor (provider, options) {
    this.provider = provider
    this.options = options || {}
  }

  /**
   * Init new storage.
   * @param {String}  name      Name of storage.
   * @param {LocalStorage}  provider  Provider to storage.
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
    return this.provider.put(filename, content)
  }

  async get (filename) {
    return this.provider.get(filename)
  }

  async getUrl (filename) {
    return this.provider.getUrl(filename).
      then((providerUrl) => [this.options.url, providerUrl].join('/'))
  }
}

module.exports = FileStorage
module.exports.default = FileStorage
module.exports.LocalStorage = LocalStorage