'use strict';

const Benchmark = require('benchmark');

const url = 'http://localhost:8000/index.js';

let result = '';

function nodeGET1 () {
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
  })
  .then(x => { result = x; })
  .catch(e => console.error(e));
}

function nodeGET2 () {
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
  })
  .then(x => { result = x; })
  .catch(e => console.error(e));
}

function nodeGET3 () {
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
.add('plain-node', nodeGET1)
.add('plain-node', nodeGET2)
.add('plain-node', nodeGET3)
.on('cycle', (event) => console.log(String(event.target)))
.on('complete', () => {
  console.log(`Result from plain node: ${result}`);
})
.run({async: true});
