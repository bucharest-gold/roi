'use strict';

const http = require('http');
const auth = require('http-auth');

class FakeAuthServer {
  static create () {
    const basic = auth.basic({ realm: 'Authenticated area.' },
      (username, password, callback) => {
        callback(username === 'admin' && password === 'admin');
      }
    );
    const server = http.createServer(basic, (request, response) => {
      response.end(`${request.user} - logged.`);
    });
    return server.listen(3005, 'localhost');
  }
}

module.exports = FakeAuthServer;
