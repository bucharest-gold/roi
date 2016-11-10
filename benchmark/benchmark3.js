'use strict';

const Benchmark = require('benchmark');
const fetch = require('node-fetch');

const url = 'http://localhost:8000/index.js';

let result = '';

function fetchGET1 () {
  return fetch(url).then(x => { result = x; }).catch(e => console.error(e));
}

function fetchGET2 () {
  return fetch(url).then(x => { result = x; }).catch(e => console.error(e));
}

function fetchGET3 () {
  return fetch(url).then(x => { result = x; }).catch(e => console.error(e));
}

const suite = new Benchmark.Suite();
Benchmark.options.minTime = -Infinity;
Benchmark.options.maxTime = -Infinity;
Benchmark.options.minSamples = 100;
Benchmark.options.initCount = 1;
suite
.add('fetch', fetchGET1)
.add('fetch', fetchGET2)
.add('fetch', fetchGET3)
.on('cycle', (event) => console.log(String(event.target)))
.on('complete', () => {
  console.log(`Result from fetch: ${result}`);
})
.run({async: true});
