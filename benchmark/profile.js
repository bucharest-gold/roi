'use strict';

const Genet = require('genet');
const roi = require('../index.js');
const jsonServer = require('json-server');

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
    'endpoint': 'http://localhost:8000/index.js'
  };
  return roi.get(opts);
}

function fooGET () {
  const opts = {
    'endpoint': 'http://localhost:8000/index.js'
  };
  return roi.get(opts);
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
    'fooGET': function (done) {
      fooGET().then(done);
    }
  };

  let num = 1;
  exports.done = function (data) {
    profile.stop().then(() => console.log('Profiling stopped'));
    bench.show(data);
    console.error('done', num);
    num = num + 1;
  };

  exports.time = 100;
  exports.countPerLap = 6;
  exports.compareCount = 8;
  profile.start();
  const bench = require('bench');
  bench.runMain();
}

createServer();
runBenchmarks();
