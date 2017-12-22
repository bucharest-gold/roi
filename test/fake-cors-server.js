'use strict';

const path = require('path');

class FakeCorsServer {

  static create (port) {
    const root = path.join(__dirname, '.', 'root');
    const server = require('http-server').createServer({
      root: root,
      cors: true,
      corsHeaders: 'X-Foo'
    });
    server.listen(port);
    return server;
  }
}

module.exports = FakeCorsServer;
