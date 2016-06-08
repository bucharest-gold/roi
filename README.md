# roi

A simple promisified http client library with zero deps.

[![Build Status](https://travis-ci.org/panther-js/roi.svg?branch=master)](https://travis-ci.org/panther-js/roi)
[![Coverage Status](https://coveralls.io/repos/github/panther-js/roi/badge.svg?branch=master)](https://coveralls.io/github/panther-js/roi?branch=master)

_Node.js 4,5,6_

* JSON.
* Basic auth.
* GET, POST, PUT, DELETE, UPLOAD[soon].
* 0 [zero] deps.

## Usage
    roi({port:3000}).get('/posts')
    .then(x => console.log(x))
    .catch(e => conole.log(e));

    roi({port:3000}).post('/posts', {foo:1, bar:'bar'})
    .then(x => console.log(x))
    .catch(e => conole.log(e));

    roi({port:3000}).put('/posts/123', {foo:4, bar:'bar'})
    .then(x => console.log(x))
    .catch(e => conole.log(e));

    roi({port:3000}).del('/posts/123')
    .then(x => console.log(x))
    .catch(e => conole.log(e));