# roi

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/roi/badge.svg)](https://coveralls.io/github/bucharest-gold/roi)
[![Build Status](https://travis-ci.org/bucharest-gold/roi.svg?branch=master)](https://travis-ci.org/bucharest-gold/roi)
[![Known Vulnerabilities](https://snyk.io/test/npm/roi/badge.svg)](https://snyk.io/test/npm/roi)
[![dependencies Status](https://david-dm.org/bucharest-gold/roi/status.svg)](https://david-dm.org/bucharest-gold/roi)

[![NPM](https://nodei.co/npm/roi.png)](https://npmjs.org/package/roi)

A dependency-free http module.

## Installation

```
npm install roi -S
```

## Usage

```js
const roi = require('roi');

roi.get('http://localhost:3000/posts')
.then(response => {
  console.log(response);
  console.log(response.statusCode);
  console.log(response.headers);
  console.log(response.body);
})
.catch(e => console.log(e));
```

## More examples

##### POST

```js
const foo = {
  title: 'foo-json',
  author: 'bgold'
};

roi.post('http://localhost:3000/posts', foo)
.then(response => console.log(response)
.catch(e => console.log(e));
```

##### PUT

```js
const foo = {
  title: 'foo-json2',
  author: 'bgold'
};

roi.put('http://localhost:3000/posts/2', foo)
.then(response => console.log(response))
.catch(e => console.log(e));
```

##### DELETE

```js
roi.del('http://localhost:3000/posts/3')
.then(response => console.log(response))
.catch(e => console.log(e));
```

##### HEAD

```js
roi.head('http://localhost:3000/posts/3')
.then(response => console.log(response.statusCode === 200))
.catch(e => console.log(e));
```

##### DOWNLOAD

```js
roi.download('https://github.com/bucharest-gold/roi/raw/master/test/green.png', '/tmp/green.png')
.then(x => console.log(x))
.catch(e => console.log(e));
```

##### UPLOAD

```js
// Fake server side app will save the file called myFileUploaded.png :
const up = (request, response) => {
  request
    .pipe(fs.createWriteStream('/tmp/myFileUploaded.png'))
    .on('finish', () => {
      response.end(request.headers.filename);
    });
};
const server = require('http').createServer(up);
server.listen(3002, () => {});
```

```js
// Upload and check if the uploaded file exists:
roi.upload('http://localhost:3002/', '/tmp/myFile.png')
.then(response => {
  console.log(fs.existsSync('/tmp/myFileUploaded.png'));
});
```

##### Basic authentication

```js
// Add the username and password:
const options = {
  endpoint: 'http://localhost:3000/',
  username: 'admin',
  password: 'admin'
};
roi.get(options)
.then(response => console.log(response))
.catch(e => console.log(e));
```

##### Remove 'Authorization' header

To avoid error like:

`Request header field Authorization is not allowed by Access-Control-Allow-Headers.`

```js
const options = {
  endpoint: 'http://localhost:3000/',
  noAuth: true
};
roi.get(options)
.then(response => console.log(response))
.catch(e => console.log(e));
```


## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)