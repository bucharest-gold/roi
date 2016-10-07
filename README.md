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
| Documentation:  | N/A |
| Issue tracker:  | https://github.com/bucharest-gold/roi/issues |
| Engines:        | Node.js 4.x, 5.x, 6.x |

## Installation

    npm install roi -S

## Usage

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

## More examples

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

    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.del(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.exists(options)
    .then(x => console.log(x.statusCode === 200))
    .catch(e => console.log(e));

    const opts = {
      'endpoint': 'http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar'
    };

    roi.download(opts, '/tmp/aesh.jar')
    .then(x => console.log(x))
    .catch(e => console.log(e));


## Benchmarks

    Scores: (bigger is better)

    roiGET
    Raw:
    > 6.479520479520479
    > 6.335664335664336
    > 5.76023976023976
    > 6.3896103896103895
    > 6.503496503496503
    > 6.5994005994005995
    > 6.497502497502498
    > 6.791208791208791
    Average (mean) 6.419580419580418

    requestGET
    Raw:
    > 4.675324675324675
    > 4.957042957042957
    > 5.070929070929071
    > 4.658682634730539
    > 5.142857142857143
    > 4.903096903096903
    > 4.886904761904762
    > 4.819180819180819
    Average (mean) 4.889252370633359

    requestPromiseGET
    Raw:
    > 4.525474525474525
    > 4.735264735264735
    > 4.885114885114885
    > 4.753246753246753
    > 4.6453546453546455
    > 4.75
    > 4.820359281437126
    > 4.987012987012987
    Average (mean) 4.762728476613208

    Winner: roiGET
    Compared with next highest (requestGET), it's:
    23.84% faster
    1.31 times as fast
    0.12 order(s) of magnitude faster
    A LITTLE FASTER

    Compared with the slowest (requestPromiseGET), it's:
    25.81% faster
    1.35 times as fast
    0.13 order(s) of magnitude faster

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)