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

const path = require('path');
const test = require('tape');
const http = require('http');
const url = require('url');
const fs = require('fs');
const roi = require('../index');
const jsonServer = require('json-server');
const auth = require('http-auth');

function createDb () {
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

function createServer () {
  const server = jsonServer.create();
  const router = jsonServer.router(createDb());
  server.use(jsonServer.defaults());
  server.use(router);
  const s = server.listen(3000);
  return s;
}

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

function createAuthServer () {
  const basic = auth.basic({ realm: 'Authenticated area.' },
    (username, password, callback) => { callback(username === 'admin' && password === 'admin'); }
  );
  const server = http.createServer(basic, (request, response) => {
    response.end(`${request.user} - logged.`);
  });
  return server.listen(3005, 'localhost');
}

test('Should get.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/posts'
  };

  roi.get(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.equal(x.headers['x-powered-by'], 'Express');
      const result = JSON.parse(x.body);
      t.equal(result[0].id, 1);
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('Should reach maximum redirects with get.', t => {
  const server = createRedirectServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  roi.get(opts)
    .then(x => {
      t.fail('Should not have succeeded');
    })
    .catch(e => {
      t.equal(e.toString(), 'Error: Maximum redirects reached.');
      t.end();
      server.close();
    });
});

test('Should redirect with get and succeed.', t => {
  const redirectServer = createRedirectServer();
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3001/05.html'
  };

  roi.get(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
      server.close();
      redirectServer.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should redirect with get and succeed to 404.', t => {
  const redirectServer = createRedirectServer();
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3001/06.html'
  };

  roi.get(opts)
    .then(x => {
      t.equal(x.statusCode, 404);
      t.end();
      server.close();
      redirectServer.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should post.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/posts'
  };

  const foo = {};

  roi.post(opts, foo)
    .then(x => {
      t.equal(x.statusCode, 201);
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('Should redirect and post.', t => {
  const redirectServer = createRedirectServer();
  const server = createServer();
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
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('Should put.', t => {
  const server = createServer();
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
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('Should redirect and put.', t => {
  const redirectServer = createRedirectServer();
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  const foo = {
    title: 'foo-json',
    author: 'bgold'
  };

  roi.put(opts, foo)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('Should check if url exists.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'https://github.com/bucharest-gold/roi'
  };

  roi.exists(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('Should redirect and delete.', t => {
  const redirectServer = createRedirectServer();
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3001/01.html'
  };

  roi.del(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
      redirectServer.close();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
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
        console.error(e);
        t.fail(e);
      }
      t.end();
    });
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
  server.listen(3002, () => {
  });

  const opts = {
    'endpoint': 'http://localhost:3002/'
  };
  roi.upload(opts, '/tmp/aesh.jar')
    .then(x => {
      try {
        fs.statSync('/tmp/uploaded.jar');
        t.equal(1, 1);
      } catch (e) {
        console.error(e);
        t.fail(e);
      }
      t.end();
      server.close();
    });
});

test('Should get and 404.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/foo.html'
  };

  roi.get(opts)
    .then(x => {
      t.equal(x.statusCode, 404);
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should post and 404.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/foo.html'
  };

  roi.post(opts)
    .then(x => {
      t.equal(x.statusCode, 404);
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should put and 404.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/foo.html'
  };

  roi.put(opts)
    .then(x => {
      t.equal(x.statusCode, 404);
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should delete and 404.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/foo.html'
  };

  roi.del(opts)
    .then(x => {
      t.equal(x.statusCode, 404);
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should download and 404.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/foo.html'
  };

  roi.download(opts, './foo.html')
    .then(x => {
      t.equal(x.statusCode, 404);
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should get with custom headers.', t => {
  const server = createServer();
  const opts = {
    'endpoint': 'http://localhost:3000/posts',
    'headers': {
      'Accept': 'text/plain',
      'Content-type': 'text/plain'
    }
  };

  roi.get(opts)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.equal(x.headers['x-powered-by'], 'Express');
      const result = JSON.parse(x.body);
      t.equal(result[0].id, 1);
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

function createFileServer () {
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

test('Should post and handle binary.', t => {
  const server = createFileServer();
  const opts = {
    'endpoint': 'http://localhost:3003/',
    'headers': {
      'Accept': 'application/octet-stream',
      'Content-type': 'application/octet-stream'
    }
  };

  roi.postStream(opts, {foo: 1}, '/tmp/green.png')
    .then(x => {
      try {
        fs.statSync('/tmp/green.png');
        t.equal(1, 1);
      } catch (e) {
        console.error(e);
        t.fail(e);
      }
      server.close();
      t.end();
    });
});

function createCORSServer () {
  const root = path.join(__dirname, '.', 'root');
  const server = require('http-server').createServer({
    root: root,
    cors: true,
    corsHeaders: 'X-Foo'
  });
  server.listen(3009);
  return server;
}

test('Should get with CORS.', t => {
  const server = createCORSServer();
  const options1 = {
    endpoint: 'http://127.0.0.1:3009/',
    method: 'OPTIONS',
    headers: {
      'Access-Control-Request-Method': 'GET',
      Origin: 'http://example.com',
      'Access-Control-Request-Headers': 'X-Foo'
    }
  };
  roi.get(options1)
    .then(x => {
      t.equal(x.headers['access-control-allow-methods'], 'GET,HEAD,POST');
    }).catch(e => {
      console.error(e);
      server.close();
      t.fail(e);
    });

  const options2 = {
    endpoint: 'http://127.0.0.1:3009/',
    method: 'OPTIONS',
    headers: {
      'Access-Control-Request-Method': 'GET',
      Origin: 'http://example.com',
      'Access-Control-Request-Headers': 'X-Bar'
    }
  };
  roi.get(options2)
    .then(x => {
      t.equal(x.headers['access-control-allow-methods'], undefined);
      server.close();
      t.end();
    }).catch(e => {
      console.error(e);
      server.close();
      t.fail(e);
    });
});

test('Should login', (t) => {
  const server = createAuthServer();

  const options = {
    endpoint: 'http://localhost:3005',
    username: 'admin',
    password: 'admin'
  };

  roi.get(options)
  .then(result => {
    t.equal(result.body, 'admin - logged.');
    server.close();
    t.end();
  }).catch(e => {
    console.error(e);
    server.close();
    t.fail(e);
  });
});

test('Should Unauthorized', (t) => {
  const server = createAuthServer();

  const options = {
    endpoint: 'http://localhost:3005',
    username: 'foo',
    password: 'bar'
  };

  roi.get(options)
    .then(result => {
      t.fail('Should not have succeeded');
    })
    .catch(e => {
      t.equal(e.toString(), '401 Unauthorized');
      t.end();
      server.close();
    });
});
