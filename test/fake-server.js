'use strict';

const jsonServer = require('json-server');

class FakeServer {

  static createDb () {
    const db = {
      'posts': [
        {
          'title': 'foo-json2',
          'author': 'bgold',
          'id': 1
        },
        {
          'title': 'foo-json',
          'author': 'bgold',
          'id': 2
        },
        {
          'title': 'foo-json',
          'author': 'bgold',
          'id': 3
        }
      ],
      'comments': [],
      'profile': {
        'name': 'bgold'
      }
    };
    return db;
  }

  static create (port) {
    const server = jsonServer.create();
    const router = jsonServer.router(this.createDb());
    server.use(jsonServer.defaults());
    server.use(router);
    const s = server.listen(port);
    return s;
  }
}

module.exports = FakeServer;
