/**
 * Copyright 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const test = require('tape');
const http = require('http');
const url = require('url');
const fs = require('fs');
const roi = require('../index');

function createRedirectServer () {
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
    }
    if (url.parse(request.url).pathname === '/02.html') {
      response.writeHead(301, {'content-type': 'text/html',
      'Location': 'http://localhost:3001/01.html'});
      response.end('Redirected from 02.');
    }
  });
  return server.listen(3001, 'localhost');
}

test('Should get.', t => {
  const opts = {
    'endpoint': 'http://localhost:3000/posts'
  };

  roi.get(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.equal(x.headers['x-powered-by'], 'Express');
      const result = JSON.parse(x.body);
      t.equal(result[0].id, 1);
      t.equal(1, 1);
      t.end();
    }).catch(e => console.log(e));
});

test('Should redirect with get.', t => {
  const server = createRedirectServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  roi.get(opts)
    .then(x => {})
    .catch(e => {
      t.equal(e.toString(), 'Error: Maximum redirects reached.');
      t.end();
      server.close();
    });
});

test('Should post.', t => {
  const opts = {
    'endpoint': 'http://localhost:3000/posts'
  };

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  roi.post(opts, foo)
    .then(x => {
      t.equal(x.statusCode, 201);
      t.end();
    }).catch(e => console.log(e));
});

test('Should redirect and post.', t => {
  const server = createRedirectServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  roi.post(opts, foo)
    .then(x => {
      t.equal(x.statusCode, 201);
      t.end();
      server.close();
    }).catch(e => console.log(e));
});

test('Should put.', t => {
  const opts = {
    'endpoint': 'http://localhost:3000/posts/1'
  };

  const foo = {
    title: 'foo-json2',
    author: 'bgold'
  };

  roi.put(opts, foo)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));
});

test('Should redirect and put.', t => {
  const server = createRedirectServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  roi.post(opts, foo)
    .then(x => {
      t.equal(x.statusCode, 201);
      t.end();
      server.close();
    }).catch(e => console.log(e));
});

test('Should check if url exists.', t => {
  const opts = {
    'endpoint': 'https://github.com/bucharest-gold/roi'
  };

  roi.exists(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));
});

test('Should redirect and delete.', t => {
  const server = createRedirectServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  roi.del(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
      server.close();
    }).catch(e => console.log(e));
});

test('Should download.', t => {
  const opts = {
    'endpoint': 'http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar'
  };

  roi.download(opts, '/tmp/aesh.jar')
    .then(x => {
      try {
        fs.statSync('/tmp/aesh.jar');
        t.equal(x.statusCode, 200);
      } catch (e) {
        console.log(e);
      }
      t.end();
    }).catch(e => console.log(e));
});

test('Should upload.', t => {
  const up = (request, response) => {
    request
      .pipe(fs.createWriteStream('/tmp/uploaded.jar'))
      .on('finish', () => {
        response.end(request.headers.filename);
      });
  };

  const server = require('http').createServer(up);
  server.listen(3002, () => { });

  const opts = {
    'endpoint': 'http://localhost:3002/'
  };
  roi.upload(opts, '/tmp/aesh.jar')
    .then(x => {
      try {
        fs.statSync('/tmp/uploaded.jar');
        t.equal(1, 1);
      } catch (e) {
        console.log(e);
      }
      t.end();
      server.close();
    }).catch(e => console.log(e));
});
