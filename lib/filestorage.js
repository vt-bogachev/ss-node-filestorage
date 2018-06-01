const container = require('./container')

const LocalStorage = require('./providers/localstorage')

class FileStorage {
  constructor (provider) {
    this.provider = provider
  }

  /**
   * Init new storage.
   * @param {String}  name      Name of storage.
   * @param {LocalStorage}  provider  Provider to storage.
   */
  static init (name, provider) {
    const fileStorage = new FileStorage()
    fileStorage.provider = provider
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

  async get () {

  }
}

module.exports = FileStorage
module.exports.default = FileStorage
module.exports.LocalStorage = LocalStorage