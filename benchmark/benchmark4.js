'use strict';

const Benchmark = require('benchmark');

const request = require('request');
const url = 'http://localhost:8000/index.js';

let result = '';

function requestGET1 () {
  return new Promise((resolve, reject) => {
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
  })
  .then(x => { result = x; })
  .catch(e => console.error(e));
}

function requestGET2 () {
  return new Promise((resolve, reject) => {
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
  })
  .then(x => { result = x; })
  .catch(e => console.error(e));
}

function requestGET3 () {
  return new Promise((resolve, reject) => {
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
  })
  .then(x => { result = x; })
  .catch(e => console.error(e));
}

const suite = new Benchmark.Suite();
Benchmark.options.minTime = -Infinity;
Benchmark.options.maxTime = -Infinity;
Benchmark.options.minSamples = 100;
Benchmark.options.initCount = 1;
suite
.add('request', requestGET1)
.add('request', requestGET2)
.add('request', requestGET3)
.on('cycle', (event) => console.log(String(event.target)))
.on('complete', () => {
  console.log(`Result from request: ${result}`);
})
.run({async: true});
