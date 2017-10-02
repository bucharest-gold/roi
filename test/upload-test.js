'use strict';

const fs = require('fs');
const test = require('tape');
const roi = require('../lib/roi');

test('UPLOAD.', t => {
  const up = (request, response) => {
    request
      .pipe(fs.createWriteStream('/tmp/readme-uploaded.md'))
      .on('finish', () => {
        response.end(request.headers.filename);
      });
  };

  const server = require('http').createServer(up);
  server.listen(3002, () => {});

  const options = {endpoint: 'http://localhost:3002/'};
  roi.upload(options, '/tmp/README.md')
    .then(response => {
      t.equals(fs.existsSync('/tmp/readme-uploaded.md'), true, 'File uploaded.');
      t.end();
      server.close();
    });
});
