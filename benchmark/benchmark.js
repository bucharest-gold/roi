'use strict';

// To run the test:
// npm install -g json-server
// json-server --watch ../test/fixtures/db.js
// npm run benchmark

const roi = require('../index.js');
const rp = require('request-promise');

function roiGET () {
  return roi({port: 3000}).get('/posts');
}

function rpGET () {
  return rp('http://localhost:3000');
}

function runBenchmarks () {
  exports.compare = {
    "roiGET" : function (done) {
      roiGET().then(done);
    },
    "rpGET" : function (done) {
      rpGET().then(done);
    }
  };

  exports.time = 1000;
  require('bench').runMain();
}

runBenchmarks();
