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
    > 1.1398601398601398
    > 1.1838161838161838
    > 1.170829170829171
    > 1.1808191808191808
    Average (mean) 1.1688311688311688

    requestGET
    Raw:
    > 0.8211788211788211
    > 0.8881118881118881
    > 0.8911088911088911
    > 0.8311688311688312
    Average (mean) 0.857892107892108

    requestPromiseGET
    Raw:
    > 0.8731268731268731
    > 0.7982017982017982
    > 0.8792415169660679
    > 0.8761238761238761
    Average (mean) 0.8566735161046539

    Winner: roiGET
    Compared with next highest (requestGET), it's:
    26.6% faster
    1.36 times as fast
    0.13 order(s) of magnitude faster
    A LITTLE FASTER

    Compared with the slowest (requestPromiseGET), it's:
    26.71% faster
    1.36 times as fast
    0.13 order(s) of magnitude faster

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)