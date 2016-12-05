'use strict';

const benchmark = require('async-benchmark');
const roi = require('../index.js');
const url = 'http://localhost:8000/index.js';
const rp = require('request-promise');

const benchRoi = (done) => {
  roi.get({ 'endpoint': url }).then(done);
};

const benchRequestPromise = (done) => {
  rp(url).then(done);
};

benchmark('request-promise', benchRequestPromise, (error, event) => {
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
