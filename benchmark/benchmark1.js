'use strict';

const Benchmark = require('benchmark');

const roi = require('../index.js');
const url = 'http://localhost:8000/index.js';

let result = '';

function roiGET1 () {
  return roi.get({ 'endpoint': url }).then(x => { result = x; }).catch(e => console.error(e));
}

function roiGET2 () {
  return roi.get({ 'endpoint': url }).then(x => { result = x; }).catch(e => console.error(e));
}

function roiGET3 () {
  return roi.get({ 'endpoint': url }).then(x => { result = x; }).catch(e => console.error(e));
}

const suite = new Benchmark.Suite();
Benchmark.options.minTime = -Infinity;
Benchmark.options.maxTime = -Infinity;
Benchmark.options.minSamples = 100;
Benchmark.options.initCount = 1;
suite
.add('roi', roiGET1)
.add('roi', roiGET2)
.add('roi', roiGET3)
.on('cycle', (event) => console.log(String(event.target)))
.on('complete', () => {
  console.log(`Result from roi: ${result}`);
})
.run({async: true});
