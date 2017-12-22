'use strict';

const fs = require('fs');
const roi = require('../lib/roi');
const os = require('os');
const { join } = require('path');

test('UPLOAD.', () => {
  expect.assertions(1);
  const up = (request, response) => {
    request
      .pipe(fs.createWriteStream(join(os.tmpdir(), 'readme-uploaded.md')))
      .on('finish', () => {
        response.end(request.headers.filename);
      });
  };

  const server = require('http').createServer(up);
  server.listen(3002, () => {});

  const file = 'README.md';
  return roi.upload('http://localhost:3002/', file)
    .then(response => {
      expect(fs.existsSync(join(os.tmpdir(), 'readme-uploaded.md'))).toBe(true);
      server.close();
    });
});
