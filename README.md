# roi

A simple promisified http client library with zero deps.

[![Build Status](https://travis-ci.org/bucharest-gold/roi.svg?branch=master)](https://travis-ci.org/bucharest-gold/roi)
[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/roi/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/roi?branch=master)

_Node.js 4,5,6_

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)

## Features:

* Basic authentication support.
* GET, POST, PUT, DELETE, DOWNLOAD, EXISTS, UPLOAD[soon].

## Usage:
    roi({port:3000}).get('/posts')
    .then(x => console.log(x))
    .catch(e => console.log(e));

    roi({port:3000}).post('/posts', {foo:1, bar:'bar'})
    .then(x => console.log(x))
    .catch(e => console.log(e));

    roi({port:3000}).put('/posts/123', {foo:4, bar:'bar'})
    .then(x => console.log(x))
    .catch(e => console.log(e));

    roi({port:3000}).del('/posts/123')
    .then(x => console.log(x))
    .catch(e => console.log(e));

    roi({port:3000, https:true}).get('/posts')
    .then(x => console.log(x))
    .catch(e => console.log(e));

    roi({ host: 'central.maven.org' })
    .download('/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar', '/tmp/aesh.jar')
    .then(x => console.log('Download ok!'))
    .catch(e => console.log(e));

    roi({ host: 'central.maven.org' })
    .exists('/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar')
    .then(x => {
        if (x.statusCode === 200) {
          console.log('Yup this URL exists!')
        }
     })
    .catch(e => console.log(e));
