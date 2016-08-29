'use strict';

// npm run benchmark

// ======================================================================
const profiler = require('v8-profiler');
const fs = require('fs');
// ======================================================================
const roi = require('../index.js');
const jsonServer = require('json-server');
const rp = require('request-promise');
const request = require('request');

// ======================================================================
profiler.startProfiling('', true);
console.log('started');
setTimeout(() => {
  console.log('finished');
  let profile = profiler.stopProfiling('');
  profile.export()
  .pipe(fs.createWriteStream('./prof-' + Date.now() + '.cpuprofile'))
  .once('error', profiler.deleteAllProfiles)
  .once('finish', profiler.deleteAllProfiles);
  profiler.deleteAllProfiles();
}, 1000);
// ======================================================================

function createDb () {
  const db = {
    'posts': [
      {
        'title': 'foo-json2',
        'author': 'bgold',
        'id': 1
      }
    ],
    'comments': [],
    'profile': {
      'name': 'bgold'
    }
  };
  return db;
}

function createServer () {
  const server = jsonServer.create();
  const router = jsonServer.router(createDb());
  server.use(jsonServer.defaults());
  server.use(router);
  const s = server.listen(3000);
  return s;
}

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

createServer();
runBenchmarks();
