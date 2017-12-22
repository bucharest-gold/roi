'use strict';

const roi = require('../lib/roi');
const FakeServer = require('./fake-server');

test('HEAD - Checks if url exists.', () => {
  expect.assertions(1);
  const server = FakeServer.create(3051);
  const options = {endpoint: 'http://localhost:3051/posts'};
  return roi.head(options)
    .then(response => {
      expect(response.statusCode).toBe(200);
      server.close();
    }).catch(e => {
      console.log(e);
      server.close();
    });
});
