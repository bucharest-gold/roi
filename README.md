# roi

A simple promisified http client library with zero deps.

[![Build Status](https://travis-ci.org/bucharest-gold/roi.svg?branch=master)](https://travis-ci.org/bucharest-gold/roi)

> _Node.js 4,5,6_

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)

## Usage:
    -- GET:
    const options = {
      'endpoint': 'http://localhost:3000/posts'
    };

    roi.get(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- POST:
    const options = {
      'endpoint': 'http://localhost:3000/posts'
    };

    const fooPost = {
      title: 'foo-json',
      author: 'bgold'
    };

    roi.post(options, fooPost)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- PUT:
    const options = {
      'endpoint': 'http://localhost:3000/posts/2'
    };

    const fooPut = {
      title: 'foo-json2',
      author: 'bgold'
    };

    roi.put(options, fooPut)
    .then(x => console.log(x))
    .catch(e => console.log(e));