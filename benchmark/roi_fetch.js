'use strict';

const benchmark = require('async-benchmark');
const roi = require('../index.js');
const url = 'http://localhost:8000/index.js';

const fetch = require('node-fetch');

const benchRoi = (done) => {
  roi.get({ 'endpoint': url }).then(done);
};

const benchFetch = (done) => {
  fetch(url).then(done);
};

benchmark('node-fetch', benchFetch, (error, event) => {
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
