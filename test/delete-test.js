'use strict';

const test = require('tape');
const roi = require('../lib/roi');

const FakeServer = require('./fake-server');
const FakeRedirectionServer = require('./fake-redirection-server');

test('DELETE - Succeed to 404.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/foo.html'};
  roi.del(options)
    .then(response => {
      t.equal(response.statusCode, 404, 'Not found.');
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('DELETE - Redirect and delete.', t => {
  const redirectServer = FakeRedirectionServer.create();
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3001/01.html'};
  roi.del(options)
    .then(response => {
      t.equal(response.statusCode, 200, 'Deleted.');
      t.end();
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});
