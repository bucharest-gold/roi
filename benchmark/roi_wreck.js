'use strict';

const benchmark = require('async-benchmark');
const roi = require('../index.js');
const url = 'http://localhost:8000/index.js';

const Wreck = require('wreck');
const Fidelity = require('fidelity');

function wreckGET () {
  return new Fidelity((resolve, reject) => {
    Wreck.request('get', url, {}, (error, response) => {
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

const benchRoi = (done) => {
  roi.get({ 'endpoint': url }).then(done);
};

const benchWreck = (done) => {
  wreckGET().then(done);
};

benchmark('wreck', benchWreck, (error, event) => {
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
