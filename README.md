# roi

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/roi/badge.svg)](https://coveralls.io/github/bucharest-gold/roi)
[![Build Status](https://travis-ci.org/bucharest-gold/roi.svg?branch=master)](https://travis-ci.org/bucharest-gold/roi)
[![Known Vulnerabilities](https://snyk.io/test/npm/roi/badge.svg)](https://snyk.io/test/npm/roi)
[![dependencies Status](https://david-dm.org/bucharest-gold/roi/status.svg)](https://david-dm.org/bucharest-gold/roi)

[![NPM](https://nodei.co/npm/roi.png)](https://npmjs.org/package/roi)

A basic and fast REST http-client library.

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0 |
| Build:          | make |
| Documentation:  | http://bucharest-gold.github.io/roi |
| Issue tracker:  | https://github.com/bucharest-gold/roi/issues |
| Engines:        | Node.js 4.x, 6.x, 7.x |

## Installation

    npm install roi -S

## Usage

```javascript
    const roi = require('roi');

    const options = {
      'endpoint': 'http://localhost:3000/posts'
    };

    roi.get(options)
    .then(x => {
       console.log(x);
       console.log(x.statusCode);
       console.log(x.headers);
       console.log(x.body);
     })
    .catch(e => console.log(e));
```

## More examples

##### POST

```javascript
    const options = {
      'endpoint': 'http://localhost:3000/posts'
    };

    const foo = {
      title: 'foo-json',
      author: 'bgold'
    };

    roi.post(options, foo)
    .then(x => console.log(x))
    .catch(e => console.log(e));
```

##### PUT

```javascript
    const options = {
      'endpoint': 'http://localhost:3000/posts/2'
    };

    const foo = {
      title: 'foo-json2',
      author: 'bgold'
    };

    roi.put(options, foo)
    .then(x => console.log(x))
    .catch(e => console.log(e));
```

##### DELETE

```javascript
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.del(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));
```

##### EXISTS

```javascript
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.exists(options)
    .then(x => console.log(x.statusCode === 200))
    .catch(e => console.log(e));
```

##### DOWNLOAD

```javascript
    const opts = {
      'endpoint': 'http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar'
    };
    roi.download(opts, '/tmp/aesh.jar')
    .then(x => console.log(x))
    .catch(e => console.log(e));
```

##### UPLOAD

```javascript
    // Fake server side app will save the file called uploaded.jar :
    const up = (request, response) => {
      request
        .pipe(fs.createWriteStream('/tmp/uploaded.jar'))
        .on('finish', () => {
          response.end(request.headers.filename);
        });
    };
    const server = require('http').createServer(up);
    server.listen(3002, () => {});
    
    // Upload and check if the uploaded file exists:
    const opts = {
      'endpoint': 'http://localhost:3002/'
    };
    roi.upload(opts, '/tmp/aesh.jar')
    .then(x => {
      try {
        fs.statSync('/tmp/uploaded.jar');
      } catch (e) {
        console.error(e);
      }
    });
```

##### Basic authentication

```javascript
    // Add the username and password:
    const opts = {
      'endpoint': 'http://localhost:3000/',
      'username': 'admin',
      'password': 'admin'
    };
    roi.get(opts)
    .then(x => console.log(x))
    .catch(e => console.log(e));
```

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)