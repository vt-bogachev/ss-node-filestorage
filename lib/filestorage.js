const container = require('./container')

const LocalStorage = require('./providers/localstorage')

class FileStorage {
  constructor (storageName, options = {}) {

  }

  /**
   * Init new storage.
   * @param {String}  name      Name of storage.
   * @param {LocalStorage}  provider  Provider to storage.
   */
  static init (name, provider) {
    container.add(name, provider)
  }

  static exists (name) {
    return container.exists(name)
  }

  async put () {

  }

  async get () {

  }
}

module.exports = FileStorage
module.exports.default = FileStorage
module.exports.LocalStorage = LocalStorage