const
  exec = require('child_process').exec,
  fs = require('fs'),
  assert = require('chai').assert,
  bytes = require('bytes'),
  fileType = require('file-type')

const
  StorageSizeValidationError = require('../lib/validators/size').StorageSizeValidationError,
  sizeValidator = require('../lib/validators/size'),
  StorageTypeValidationError = require('../lib/validators/types').StorageTypeValidationError,
  typeValidator = require('../lib/validators/types'),
  StorageValidationErrors = require('./../lib/validators/validation.error')

const
  FileStorage = require('../index')

describe('FileStorage', () => {

  it('Check non exists storage.', (done) => {
    assert.isFalse(FileStorage.exists('nonExistsStorage'))
    done()
  })

  describe('Validator', () => {

    describe('Size Validator', () => {

      it('Test error of size validator', (done) => {
        const storageSizeValidationError = new StorageSizeValidationError('VALIDATOR.SIZE.MIN', {
          size: 1000,
          min: 10
        })
        assert.instanceOf(storageSizeValidationError, StorageSizeValidationError)
        assert.equal(storageSizeValidationError.name, 'StorageSizeValidationError')
        assert.equal(storageSizeValidationError.message, 'VALIDATOR.SIZE.MIN')
        assert.deepEqual(storageSizeValidationError.options, {size: 1000, min: 10})
        assert.equal(storageSizeValidationError.toString(), 'VALIDATOR.SIZE.MIN Content size: 1000 Limit: undefined')
        done()
      })

      it('Test size validator', (done) => {
        const content = Buffer.from('test')
        const result = sizeValidator(content, {min: 10, max: 20})
        assert.typeOf(result, 'array')
        assert.equal(result.length, 1)
        const error = result[0]
        assert.instanceOf(error, StorageSizeValidationError)
        assert.equal(error.toString(), 'VALIDATOR.SIZE.MIN Content size: 4 Limit: 10')
        done()
      })

    })

    describe('Type Validator', () => {

      it('Test error of type validator', (done) => {
        const storageTypeValidationError = new StorageTypeValidationError('VALIDATOR.TYPE', {
          type: 'jpg',
          types: ['jpg', 'png']
        })
        assert.instanceOf(storageTypeValidationError, StorageTypeValidationError)
        assert.equal(storageTypeValidationError.name, 'StorageTypeValidationError')
        assert.equal(storageTypeValidationError.message, 'VALIDATOR.TYPE')
        assert.deepEqual(storageTypeValidationError.options, {
          type: 'jpg',
          types: ['jpg', 'png']
        })
        assert.equal(storageTypeValidationError.toString(), 'VALIDATOR.TYPE Content type: jpg Available types: jpg,png')
        done()
      })

      it('Test type validator. Invalid data.', (done) => {
        const content = fs.readFileSync(`${__dirname}/_testdata/image.png`)
        const result = typeValidator(fileType(content), ['jpg'])
        assert.typeOf(result, 'array')
        assert.equal(result.length, 1)
        const error = result[0]
        assert.instanceOf(error, StorageTypeValidationError)
        assert.equal(error.toString(), 'VALIDATOR.TYPE Content type: png Available types: jpg')
        done()
      })

      it('Test type validator. Valid data.', (done) => {
        const content = fs.readFileSync(`${__dirname}/_testdata/image.png`)
        const result = typeValidator(fileType(content), ['png'])
        assert.typeOf(result, 'array')
        assert.equal(result.length, 0)
        done()
      })

    })

  })

  describe('Providers', () => {

    before(() => {
      const storagePath = `${__dirname}/_storage`
      exec(`rm -Rf ${storagePath}`)
    })

    it('Check define storage with invalid options.', (done) => {
      try {
        FileStorage.init('avatar', new FileStorage.LocalStorage())
        done(new Error('Test failed.'))
      } catch (err) {
        assert.typeOf(err, 'Error')
        assert.equal(err.message, 'LocalStorage [options]. Should set options.')
        done()
      }
    })

    it('Check define storage without path options.', (done) => {
      try {
        FileStorage.init('avatar', new FileStorage.LocalStorage({
          somekey: '../../'
        }))
        done(new Error('Test failed.'))
      } catch (err) {
        assert.typeOf(err, 'Error')
        assert.equal(err.message, 'LocalStorage [options.path]. Not found.')
        done()
      }
    })

    it('Check define storage with invalid path options.', (done) => {
      try {
        FileStorage.init('avatar', new FileStorage.LocalStorage({
          path: '../../'
        }))
        done(new Error('Test failed.'))
      } catch (err) {
        assert.typeOf(err, 'Error')
        assert.equal(err.message, 'LocalStorage [options.storagePath]. Should set only absolute path.')
        done()
      }
    })

    it('Check define valid storage.', (done) => {
      FileStorage.init('avatar', new FileStorage.LocalStorage({
        path: `${__dirname}/_storage/public`
      }), {
        url: 'http://localhost:8000',
        validators: {
          size: {min: bytes('10b'), max: bytes('15b')}
        }
      })
      assert.isTrue(FileStorage.exists('avatar'))
      done()
    })

    it('Check exists storage.', (done) => {
      assert.isTrue(FileStorage.exists('avatar'))
      done()
    })

    it('Check available to use storage', (done) => {
      assert.instanceOf(FileStorage.use('avatar'), FileStorage)
      done()
    })

    it('Put file to storage. Valid data.', (done) => {
      FileStorage.use('avatar').put('aaa.txt', '01234567891').then((result) => {
        assert.isTrue(result)
        done()
      }).catch(done => console.log(done))
    })

    it('Put file to storage. Check size limit.', (done) => {
      FileStorage.use('avatar').put('aaa.txt', '0123456').then((result) => {
        done('Invalid validator processing.')
      }).catch(() => done())
    })

    it('Get non exists file from storage', (done) => {
      FileStorage.use('avatar').get('bbb.txt').then(() => {
        done(new Error('Test failed.'))
      }).catch((err) => {
        assert.typeOf(err, 'Error')
        assert.equal(err.message, 'FILE_NOT_FOUND')
        done()
      })
    })

    it('Get exists file from storage', (done) => {
      FileStorage.use('avatar').get('aaa.txt').then((content) => {
        assert.equal('01234567891', content)
        done()
      }).catch(done)
    })

    it('Get url for a file', (done) => {
      FileStorage.use('avatar').getUrl('aaa.txt').then((url) => {
        assert.equal(url, 'http://localhost:8000/aaa.txt')
        done()
      }).catch(done)
    })

    it('Remove file', (done) => {
      FileStorage.use('avatar').remove('aaa.txt').then((result) => {
        assert.equal(result, true)
        done()
      }).catch(done)
    })

    it('Check define valid image storage.', (done) => {
      FileStorage.init('image', new FileStorage.LocalStorage({
        path: `${__dirname}/_storage/image`
      }), {
        url: 'http://localhost:8000',
        validators: {
          size: {min: bytes('10b'), max: bytes('100Kb')},
          types: ['png']
        }
      })
      assert.isTrue(FileStorage.exists('avatar'))
      done()
    })

    it('Save image', (done) => {
      const fileContent = fs.readFileSync(`${__dirname}/_testdata/image.png`)
      FileStorage.use('image').put('image.jpg', fileContent).
        then((result) => done()).
        catch((err) => {
          console.log(err)
          done(err)
        })
    })

  })

})
