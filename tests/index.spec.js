const
  exec = require('child_process').exec,
  fs = require('fs'),
  assert = require('chai').assert

const
  FileStorage = require('../index')

describe('FileStorage', () => {

  it('Check non exists storage.', (done) => {
    assert.isFalse(FileStorage.exists('nonExistsStorage'))
    done()
  })

  describe('Providers', () => {

    describe('LocalStorage', () => {

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

      it('Check define storage.', (done) => {
        FileStorage.init('avatar', new FileStorage.LocalStorage({
          path: `${__dirname}/_storage/public`
        }))
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

      it('Put file to storage', (done) => {
        FileStorage.use('avatar').put('aaa.txt', 'content').then((result) => {
          assert.isTrue(result)
          done()
        }).catch(done)
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
          assert.equal('content', content)
          done()
        }).catch(done)
      })

    })

  })

})