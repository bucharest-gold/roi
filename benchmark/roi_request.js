'use strict';

const benchmark = require('async-benchmark');
const roi = require('../index.js');
const url = 'http://localhost:8000/index.js';

const request = require('request');
const Fidelity = require('fidelity');

function requestGET () {
  return new Fidelity((resolve, reject) => {
    request.get(url, (error, response, body) => {
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

const benchRoi = (done) => {
  roi.get({ 'endpoint': url }).then(done);
};

const benchRequest = (done) => {
  requestGET().then(done);
};

benchmark('request', benchRequest, (error, event) => {
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
