'use strict';

const Genet = require('genet');
const roi = require('../index.js');
const jsonServer = require('json-server');
const rp = require('request-promise');
const request = require('request');
const Wreck = require('wreck');
const fetch = require('node-fetch');

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

function nodeGET () {
  const url = 'http://localhost:3000/posts';
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? require('https') : require('http');
    const request = protocol.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load, status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
  });
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

function wreckGET () {
  return new Promise((resolve, reject) => {
    Wreck.request('get', 'http://localhost:3000/posts', {}, (error, response) => {
      if (error) {
        return reject(error);
      }
      if (!response.body) {
        return resolve(response.statusCode);
      }
      if (response.errorCode) {
        return reject(response.message);
      }
      return resolve(response);
    });
  });
}

function fetchGET () {
  return fetch('http://localhost:3000/posts');
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
    'nodeGET': function (done) {
      nodeGET().then(done);
    },
    'roiGET': function (done) {
      roiGET().then(done);
    },
    'requestPromiseGET': function (done) {
      requestPromiseGET().then(done);
    },
    'requestGET': function (done) {
      requestGET().then(done);
    },
    'wreckGET': function (done) {
      wreckGET().then(done);
    },
    'fetchGET': function (done) {
      fetchGET().then(done);
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
