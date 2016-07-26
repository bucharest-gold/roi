'use strict';

// To run the test:
// npm install -g json-server
// json-server --watch test/fixtures/db.json
// another terminal run: npm run benchmark

const roi = require('../index.js');
const rp = require('request-promise');
const request = require('request');

function roiGET () {
  const opts = {
    'endpoint': 'http://localhost:3000/posts'
  };
  return roi.get(opts);
}

function requestPromiseGET () {
  return rp('http://localhost:3000/posts');
}

function requestGET () {
  return new Promise((resolve, reject) => {
    request.get('http://localhost:3000/posts', (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (!body) {
        return resolve(response.statusCode);
      }
      if (body.errorCode) {
        return reject(body.message);
      }
      return resolve(body);
    });
  });
}

function runBenchmarks () {
  exports.compare = {
    'roiGET': function (done) {
      roiGET().then(done);
    },
    'requestPromiseGET': function (done) {
      requestPromiseGET().then(done);
    },
    'requestGET': function (done) {
      requestGET().then(done);
    }
  };

  exports.time = 1000;
  require('bench').runMain();
}

runBenchmarks();
