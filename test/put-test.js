'use strict';

const test = require('tape');
const roi = require('../lib/roi');

const FakeServer = require('./fake-server');
const FakeRedirectionServer = require('./fake-redirection-server');

test('PUT.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/posts/1'};

  const foo = {
    title: 'foo-json2',
    author: 'bgold'
  };

  roi.put(options, foo)
    .then(response => {
      t.equal(response.statusCode, 200, 'Data sent to server.');
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('PUT - Redirect.', t => {
  const redirectServer = FakeRedirectionServer.create();
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3001/01.html'};

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  roi.put(options, foo)
    .then(response => {
      t.equal(response.statusCode, 200, 'Redirect with put.');
      t.end();
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('PUT - Succeed to 404.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/foo.html'};
  roi.put(options)
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
