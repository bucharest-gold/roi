'use strict';

const benchmark = require('async-benchmark');
const roi = require('../index.js');
const url = 'http://localhost:8000/index.js';

const Fidelity = require('fidelity');

function nodeGET () {
  return new Fidelity((resolve, reject) => {
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

const benchRoi = (done) => {
  roi.get({ 'endpoint': url }).then(done);
};

const benchNode = (done) => {
  nodeGET().then(done);
};

benchmark('node', benchNode, (error, event) => {
  if (error) {
    console.error(error);
  }
  console.log(event.target.toString());
  benchmark('roi', benchRoi, (error, event) => {
    if (error) {
      console.error(error);
    }
    console.log(event.target.toString());
  });
});
