'use strict';

const fs = require('fs');
const roi = require('../lib/roi');
const os = require('os');
const { join } = require('path');

test('DOWNLOAD.', () => {
  expect.assertions(2);
  const file = join(os.tmpdir(), 'README.md');
  return roi.download('https://raw.githubusercontent.com/bucharest-gold/roi/master/README.md', file)
    .then(response => {
      expect(fs.existsSync(file)).toBe(true);
      expect(response.statusCode).toBe(200);
    });
});
