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

##### POST
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

##### PUT
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

##### DELETE
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.del(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));

##### EXISTS
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.exists(options)
    .then(x => console.log(x.statusCode === 200))
    .catch(e => console.log(e));

##### DOWNLOAD
    const opts = {
      'endpoint': 'http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar'
    };
    roi.download(opts, '/tmp/aesh.jar')
    .then(x => console.log(x))
    .catch(e => console.log(e));

##### UPLOAD
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

## Benchmarks

    Scores: (bigger is better)

    roiGET
    Raw:
    > 4.616766467065868
    > 5.160839160839161
    > 4.679282868525896
    > 1.9580838323353293
    > 5.245508982035928
    > 4.999000999000999
    > 5.274725274725275
    > 5.179640718562874
    Average (mean) 4.639231037886416

    wreckGET
    Raw:
    > 4.075924075924076
    > 5.057654075546719
    > 2.298507462686567
    > 5.136863136863137
    > 5.130869130869131
    > 5.136863136863137
    > 5.130869130869131
    > 5.1437125748503
    Average (mean) 4.638907840559025

    nodeGET
    Raw:
    > 4.338645418326693
    > 2.5774225774225776
    > 3.6430707876370887
    > 4.820359281437126
    > 5.364635364635364
    > 5.268731268731269
    > 5.25748502994012
    > 5.180458624127617
    Average (mean) 4.5563510440322315

    fetchGET
    Raw:
    > 2.979020979020979
    > 3.940119760479042
    > 3.976119402985075
    > 2.0119760479041915
    > 4.630109670987039
    > 4.544731610337972
    > 4.609390609390609
    > 4.807192807192807
    Average (mean) 3.937332611037214

    requestGET
    Raw:
    > 3.6706586826347305
    > 3.5244755244755246
    > 4.105894105894106
    > 2.793206793206793
    > 4.033966033966034
    > 3.956043956043956
    > 4.03996003996004
    > 3.754491017964072
    Average (mean) 3.734837019268157

    requestPromiseGET
    Raw:
    > 1.4177467597208375
    > 3.716283716283716
    > 3.633466135458167
    > 3.5209580838323356
    > 3.5964035964035963
    > 3.932067932067932
    > 3.6863136863136865
    > 3.89010989010989
    Average (mean) 3.4241687250237702

    Winner: roiGET
    Compared with next highest (wreckGET), it's:
    0.01% faster
    1 times as fast
    0 order(s) of magnitude faster
    BASICALLY THE SAME

    Compared with the slowest (requestPromiseGET), it's:
    26.19% faster
    1.35 times as fast
    0.13 order(s) of magnitude faster

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)