'use strict';

const fs = require('fs');
const roi = require('../lib/roi');
const os = require('os');
const { join } = require('path');

test('DOWNLOAD.', () => {
  expect.assertions(2);
  const options = {endpoint: 'https://raw.githubusercontent.com/bucharest-gold/roi/master/README.md'};
  const file = join(os.tmpdir(), 'README.md');
  return roi.download(options, file)
    .then(response => {
      expect(fs.existsSync(file)).toBe(true);
      expect(response.statusCode).toBe(200);
    });
});
