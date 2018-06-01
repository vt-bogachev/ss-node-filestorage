class StorageContainer {

  constructor () {
    this.storages = {}
  }

  add (name, storage) {
    this.storages[name] = storage
  }

  exists (name) {
    return !!this.storages[name]
  }

}

module.exports = new StorageContainer()