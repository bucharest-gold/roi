'use strict';

const fs = require('fs');
const test = require('tape');
const roi = require('../lib/roi');
const os = require('os');
const { join } = require('path');

test('UPLOAD.', t => {
  const up = (request, response) => {
    request
      .pipe(fs.createWriteStream(join(os.tmpdir(),'readme-uploaded.md')))
      .on('finish', () => {
        response.end(request.headers.filename);
      });
  };

  const server = require('http').createServer(up);
  server.listen(3002, () => {});

  const options = {endpoint: 'http://localhost:3002/'};
  const file = join(os.tmpdir(), 'README.md');
  roi.upload(options, file)
    .then(response => {
      t.equals(fs.existsSync(join(os.tmpdir(), 'readme-uploaded.md')), true, 'File uploaded.');
      t.end();
      server.close();
    });
});
