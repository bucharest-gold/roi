// 'use strict';

// const fs = require('fs');
// const test = require('tape');
// const roi = require('../lib/roi');

// const FakeFileServer = require('./fake-file-server');

// test('POST-STREAM - Post and handle binary.', t => {
//   const server = FakeFileServer.create();
//   const options = {
//     endpoint: 'http://localhost:3003/',
//     headers: {
//       'Accept': 'application/octet-stream',
//       'Content-type': 'application/octet-stream'
//     }
//   };
//   roi.postStream(options, {foo: 1}, './green.png')
//     .then(response => {
//       t.equal(fs.existsSync('/tmp/green.png'), true, 'The file exists.');
//       server.close();
//       t.end();
//     })
//     .catch(e => {
//       console.error(e);
//       t.fail();
//     });
// });
