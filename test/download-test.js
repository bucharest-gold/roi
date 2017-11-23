'use strict';

const fs = require('fs');
const test = require('tape');
const roi = require('../lib/roi');
const os = require('os');
const { join } = require('path');

const FakeServer = require('./fake-server');

test('DOWNLOAD.', t => {
  const options = {endpoint: 'https://raw.githubusercontent.com/bucharest-gold/roi/master/README.md'};
  const file = join(os.tmpdir(), 'README.md');
  roi.download(options, file)
    .then(response => {
      t.equal(fs.existsSync(file), true, 'File downloaded.');
      t.equal(response.statusCode, 200);
      t.end();
    });
});

test('DOWNLOAD - succeed to 404.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/foo.html'};
  roi.download(options, './foo.html')
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
