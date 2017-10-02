'use strict';

const test = require('tape');
const roi = require('../lib/roi');

const FakeServer = require('./fake-server');
const FakeRedirectionServer = require('./fake-redirection-server');

test('POST.', t => {
  const server = FakeServer.create();
  const options = { endpoint: 'http://localhost:3000/posts' };
  const foo = {};
  roi.post(options, foo)
    .then(response => {
      t.equal(response.statusCode, 201, 'Data sent to server.');
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('POST - Redirect.', t => {
  const redirectServer = FakeRedirectionServer.create();
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3001/01.html'};

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  roi.post(options, foo)
    .then(response => {
      t.equal(response.statusCode, 201, 'Redirect with post.');
      t.end();
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('POST - Succeed to 404.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/foo.html'};
  roi.post(options)
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
