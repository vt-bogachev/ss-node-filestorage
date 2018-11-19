![badge](https://travis-ci.org/vt-bogachev/ss-node-filestorage.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/vt-bogachev/ss-node-filestorage/badge.svg)](https://coveralls.io/github/vt-bogachev/ss-node-filestorage)

FileStorage
=========================

Simple module for saving and loading files into local storage.

If you want to see new features, create new issue, please.

[https://github.com/vt-bogachev/ss-node-filestorage/issues](https://github.com/vt-bogachev/ss-node-filestorage/issues)

Installation
------------
```
npm i ss-node-filestorage
```

How to using?
```javascript
const FileStorage = require('ss-node-filestorage')

// Init storage
FileStorage.init('avatar', new FileStorage.LocalStorage({
  path: `${__dirname}/_storage/public`
}),{
  url:'http://localhost:8000'
})

// Save file
// File will be save as __dirname/_storage/public/filename.text
FileStorage.use('avatar').
  put('filename.text','content file')

// Get file
FileStorage.use('avatar').
  get('filename.text','content file').
  then((content)=>console.log(content))
  
// Get file url
FileStorage.use('avatar').
  getUrl('filename.text').
  then((fileUrl)=>console.log(fileUrl))
  
// Get path to file  
FileStorage.use('avatar').
  getPath('filename.text').
  then((fileUrl)=>console.log(fileUrl))  
  
// Remove file  
FileStorage.use('avatar').
  remove('filename.text').
  then((result)=>console.log(result))
 

// ================================================
// OR
// ================================================

const avatarStorage = FileStorage.use('avatar');
Promise.all([
  avatarStorage.get('file1'),  
  avatarStorage.get('file2')
]).then(([file1Content, file2Content])=>{
  console.log({file1Content, file2Content})
})

// ================================================
// Validation (@beta)
// Available 2 types of validation:
//  size - validation by size of content
//    size: {min: 10, max: 100}
//    size: {min: 10}
//    size: {max: 100}
//  types - validation by tipe of file
//    types: ['png']
//    types: ['png','jpg']
// ================================================
FileStorage.init('image', new FileStorage.LocalStorage({
  path: `${__dirname}/_storage/image`
}), {
  url: 'http://localhost:8000',
  validators: {
    size: {min: 10, max: 100},
    types: ['png']
  }
})

```

Tools
---------------------------
[TravisCI](https://travis-ci.org/), [Coveralls](https://coveralls.io)