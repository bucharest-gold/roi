'use strict';

const http = require('http');
const url = require('url');

class FakeRedirectionServer {

  static create () {
    const server = http.createServer((request, response) => {
      if (url.parse(request.url).pathname === '/01.html') {
        if (request.method === 'POST') {
          response.writeHead(301, {'content-type': 'text/html',
            'Location': 'http://localhost:3000/posts'});
          response.end('Redirected to another server.');
        } else if (request.method === 'PUT') {
          response.writeHead(301, {'content-type': 'text/html',
            'Location': 'http://localhost:3000/posts/1'});
          response.end('Redirected to another server.');
        } else if (request.method === 'DELETE') {
          response.writeHead(301, {'content-type': 'text/html',
            'Location': 'http://localhost:3000/posts/3'});
          response.end('Redirected to another server.');
        } else {
          response.writeHead(301, {'content-type': 'text/html',
            'Location': 'http://localhost:3001/02.html'});
          response.end('Redirected from 01.');
        }
      } else if (url.parse(request.url).pathname === '/02.html') {
        response.writeHead(301, {'content-type': 'text/html',
          'Location': 'http://localhost:3001/01.html'});
        response.end('Redirected from 02.');
      } else if (url.parse(request.url).pathname === '/05.html') {
        response.writeHead(301, {'content-type': 'text/html',
          'Location': 'http://localhost:3000/posts'});
        response.end('Redirected from 05.');
      } else if (url.parse(request.url).pathname === '/06.html') {
        response.writeHead(301, {'content-type': 'text/html',
          'Location': 'http://localhost:3000/postaaaa'});
        response.end('Redirected from 06.');
      }
    });
    return server.listen(3001, 'localhost');
  }
}

module.exports = FakeRedirectionServer;
