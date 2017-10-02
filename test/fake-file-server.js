'use strict';

const http = require('http');
const path = require('path');

class FakeFileServer {
  static create () {
    const handler = (request, response) => {
      request.on('data', (d) => {
        console.log(`You posted: ${d}`);
      });
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/octet-stream');
      const buf = require('fs').readFileSync(path.join(__dirname, '/green.png'));
      response.end(buf);
    };
    const s = http.createServer(handler);
    s.listen(3003);
    return s;
  }
}

module.exports = FakeFileServer;
