'use strict';

const path = require('path');

class FakeCorsServer {

  static create () {
    const root = path.join(__dirname, '.', 'root');
    const server = require('http-server').createServer({
      root: root,
      cors: true,
      corsHeaders: 'X-Foo'
    });
    server.listen(3009);
    return server;
  }
}

module.exports = FakeCorsServer;
