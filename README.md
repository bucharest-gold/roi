# roi

A simple promisified http client library with zero deps.

[![npm package](https://nodei.co/npm/roi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/roi/)

[![Build Status](https://travis-ci.org/bucharest-gold/roi.svg?branch=master)](https://travis-ci.org/bucharest-gold/roi)

> _Node.js 4,5,6_

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)

## Usage:

    -- General example:
    roi.get(options)
    .then(x => {
       console.log(x.statusCode);
       console.log(x.headers);
       console.log(x.body);
       console.log(JSON.parse(x.body).foo);
     })
    .catch(e => console.log(e));

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

    const foo = {
      title: 'foo-json',
      author: 'bgold'
    };

    roi.post(options, foo)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- PUT:
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

    -- DELETE:
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.del(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- EXISTS:
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.exists(options)
    .then(x => console.log(x.statusCode === 200))
    .catch(e => console.log(e));

    -- DOWNLOAD:
    const opts = {
      'endpoint': 'http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar'
    };

    roi.download(opts, '/tmp/aesh.jar')
    .then(x => console.log(x))
    .catch(e => console.log(e));