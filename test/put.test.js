'use strict';

const roi = require('../lib/roi');

const FakeServer = require('./fake-server');
const FakeRedirectionServer = require('./fake-redirection-server');

test('PUT.', () => {
  expect.assertions(1);
  const server = FakeServer.create(3061);

  const foo = {
    title: 'foo-json2',
    author: 'bgold'
  };

  return roi.put('http://localhost:3061/posts/1', foo)
    .then(response => {
      expect(response.statusCode).toBe(200);
      server.close();
    }).catch(e => {
      console.error(e);
      server.close();
    });
});

test('PUT - Redirect.', () => {
  expect.assertions(1);
  const redirectServer = FakeRedirectionServer.create();
  const server = FakeServer.create(3000);

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  return roi.put('http://localhost:3001/01.html', foo)
    .then(response => {
      expect(response.statusCode).toBe(200);
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      redirectServer.close();
      server.close();
    });
});

test('PUT - Succeed to 404.', () => {
  expect.assertions(1);
  const server = FakeServer.create(3062);
  return roi.put('http://localhost:3062/foo.html')
    .then(response => {
      expect(response.statusCode).toBe(404);
      server.close();
    })
    .catch(e => {
      console.error(e);
      server.close();
    });
});
