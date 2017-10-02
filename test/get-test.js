'use strict';

const test = require('tape');
const roi = require('../lib/roi');

const FakeServer = require('./fake-server');
const FakeRedirectionServer = require('./fake-redirection-server');
const FakeAuthServer = require('./fake-auth-server');
const FakeCorsServer = require('./fake-cors-server');

test('GET.', t => {
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3000/posts'};
  roi.get(options)
    .then(response => {
      t.equal(response.statusCode, 200, 'Status code: 200');
      t.equal(response.headers['x-powered-by'], 'Express', 'Header x-powered-by: Express');
      const result = JSON.parse(response.body);
      t.equal(result[0].id, 1, 'The first ID is: 1');
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('GET - Reach maximum redirects.', t => {
  const server = FakeRedirectionServer.create();
  const options = {endpoint: 'http://localhost:3001/01.html'};
  roi.get(options)
    .then(response => {
      console.log(response);
      t.fail('Should not have succeeded');
    })
    .catch(e => {
      t.equal(e.toString(), 'Error: Maximum redirects reached. (Amount of redirects allowed: 3)', `Maximum redirects reached. (Amount of redirects allowed: 3)`);
      t.end();
      server.close();
    });
});

test('GET - Redirect and succeed.', t => {
  const redirectServer = FakeRedirectionServer.create();
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3001/05.html'};
  roi.get(options)
    .then(response => {
      t.equal(response.statusCode, 200, 'Redirected and OK.');
      t.end();
      server.close();
      redirectServer.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('GET - Redirect and succeed to 404.', t => {
  const redirectServer = FakeRedirectionServer.create();
  const server = FakeServer.create();
  const options = {endpoint: 'http://localhost:3001/06.html'};
  roi.get(options)
    .then(response => {
      t.equal(response.statusCode, 404, 'Redirected and not found.');
      t.end();
      server.close();
      redirectServer.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('GET - Succeed to 404.', t => {
  const server = FakeServer.create();
  const options = { endpoint: 'http://localhost:3000/foo.html' };
  roi.get(options)
    .then(response => {
      t.equal(response.statusCode, 404, 'Not found.');
      t.end();
      server.close();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('GET - Using custom headers.', t => {
  const server = FakeServer.create();
  const options = {
    endpoint: 'http://localhost:3000/posts',
    headers: {
      'Accept': 'text/plain',
      'Content-type': 'text/plain'
    }
  };

  roi.get(options)
    .then(response => {
      t.equal(response.statusCode, 200, 'Status code: 200');
      t.equal(response.headers['x-powered-by'], 'Express', 'Header x-powered-by: Express');
      const result = JSON.parse(response.body);
      t.equal(result[0].id, 1, 'The first ID is: 1');
      t.end();
      server.close();
    }).catch(e => {
      console.error(e);
      t.fail(e);
    });
});

test('GET - CORS enabled.', t => {
  const server = FakeCorsServer.create();
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
    .then(response => {
      t.equal(response.headers['access-control-allow-methods'], 'GET,HEAD,POST', 'access-control-allow-methods: GET,HEAD,POST');
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
    .then(response => {
      t.equal(response.headers['access-control-allow-methods'], undefined, 'access-control-allow-methods: undefined. No X-Bar CORS header for this server.');
      server.close();
      t.end();
    }).catch(e => {
      console.error(e);
      server.close();
      t.fail(e);
    });
});

test('GET - login', (t) => {
  const server = FakeAuthServer.create();
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

test('GET - Unauthorized', (t) => {
  const server = FakeAuthServer.create();
  const options = {
    endpoint: 'http://localhost:3005',
    username: 'foo',
    password: 'bar'
  };

  roi.get(options)
    .then(response => {
      t.fail('Should not have succeeded.');
    })
    .catch(e => {
      t.equal(e.toString(), '401 Unauthorized', '401 Unauthorized');
      t.end();
      server.close();
    });
});
