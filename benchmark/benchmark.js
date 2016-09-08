'use strict';

const Genet = require('genet');
const roi = require('../index.js');
const jsonServer = require('json-server');
const rp = require('request-promise');
const request = require('request');

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
  const profile = new Genet({
    profileName: 'roi',
    filter: /^(?!.*benchmark)(?=.*roi).*/,
    duration: 1000,
    showAppOnly: true,
    verbose: true,
    flamegraph: true
  });

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

  let num = 1;
  exports.done = function (data) {
    profile.stop().then(() => console.log('Profiling stopped'));
    bench.show(data);
    console.error('done', num);
    num = num + 1;
  };

  exports.time = 1000;
  exports.countPerLap = 6;
  exports.compareCount = 8;
  profile.start();
  const bench = require('bench');
  bench.runMain();
}

createServer();
runBenchmarks();
