'use strict';

const test = require('tape');
const roi = require('../lib/roi');

const FakeServer = require('./fake-server');

test('HEAD - Checks if url exists.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/posts'};
  roi.head(options)
    .then(response => {
      t.equal(response.statusCode, 200, 'http://localhost:3000/posts exists.');
      t.end();
      server.close();
    }).catch(e => {
      console.log(e);
      t.fail(e);
    });
});
