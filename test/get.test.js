'use strict';

const roi = require('../lib/roi');

const FakeServer = require('./fake-server');
const FakeRedirectionServer = require('./fake-redirection-server');
const FakeAuthServer = require('./fake-auth-server');
const FakeCorsServer = require('./fake-cors-server');

test('GET.', () => {
  expect.assertions(3);
  const server = FakeServer.create(5000);
  return roi.get('http://localhost:5000/posts')
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['x-powered-by']).toBe('Express');
      const result = JSON.parse(response.body);
      expect(result[0].id).toBe(1);
      server.close();
    }).catch(e => {
      console.error(e);
      server.close();
    });
});

test('GET - Reach maximum redirects.', () => {
  expect.assertions(1);
  const server = FakeRedirectionServer.create();
  return roi.get('http://localhost:3001/01.html')
    .then(response => {
      console.log(response);
    })
    .catch(e => {
      expect(e.toString()).toBe('Error: Maximum redirects reached. (Amount of redirects allowed: 3)');
      server.close();
    });
});

test('GET - Host not exist.', () => {
  expect.assertions(1);
  return roi.get('http://foobarfoo:9000/')
    .then(response => {
      server.close();
    }).catch(e => {
      expect(e.toString()).toBe('Error: getaddrinfo ENOTFOUND foobarfoo foobarfoo:9000');
    });
});

// test('GET - Redirect and succeed.', () => {
//   expect.assertions(1);
//   const redirectServer = FakeRedirectionServer.create();
//   const server = FakeServer.create(5001);
//   const options = {endpoint: 'http://localhost:5001/05.html'};
//   return roi.get(options)
//     .then(response => {
//       expect(response.statusCode).toBe(200);
//       server.close();
//       redirectServer.close();
//     })
//     .catch(e => {
//       console.error(e);
//       redirectServer.close();
//     });
// });

// test('GET - Redirect and succeed to 404.', () => {
//   expect.assertions(1);
//   const redirectServer = FakeRedirectionServer.create();
//   const server = FakeServer.create(5002);
//   const options = {endpoint: 'http://localhost:5002/06.html'};
//   return roi.get(options)
//     .then(response => {
//       expect(response.statusCode).toBe(404);
//       server.close();
//       redirectServer.close();
//     })
//     .catch(e => {
//       console.error(e);
//     });
// });

test('GET - Succeed to 404.', () => {
  expect.assertions(1);
  const server = FakeServer.create(5003);
  return roi.get('http://localhost:5003/foo.html')
    .then(response => {
      expect(response.statusCode).toBe(404);
      server.close();
    })
    .catch(e => {
      console.error(e);
    });
});

test('GET - Using custom headers.', () => {
  expect.assertions(3);
  const server = FakeServer.create(5004);
  const options = {
    endpoint: 'http://localhost:5004/posts',
    headers: {
      'Accept': 'text/plain',
      'Content-type': 'text/plain'
    }
  };

  return roi.get(options)
    .then(response => {
      expect(response.statusCode).toBe(200, 'Status code: 200');
      expect(response.headers['x-powered-by']).toBe('Express');
      const result = JSON.parse(response.body);
      expect(result[0].id).toBe(1);
      server.close();
    }).catch(e => {
      console.error(e);
    });
});

test('GET - CORS enabled.', () => {
  expect.assertions(1);
  const server = FakeCorsServer.create(3009);
  const options = {
    endpoint: 'http://127.0.0.1:3009/',
    method: 'OPTIONS',
    headers: {
      'Access-Control-Request-Method': 'GET',
      Origin: 'http://example.com',
      'Access-Control-Request-Headers': 'X-Foo'
    }
  };
  return roi.get(options)
    .then(response => {
      expect(response.headers['access-control-allow-methods']).toBe('GET,HEAD,POST');
      server.close();
    }).catch(e => {
      console.error(e);
      server.close();
    });
});

test('GET - CORS enabled 2.', () => {
  expect.assertions(1);
  const server = FakeCorsServer.create(3010);
  const options = {
    endpoint: 'http://127.0.0.1:3010/',
    method: 'OPTIONS',
    headers: {
      'Access-Control-Request-Method': 'GET',
      Origin: 'http://example.com',
      'Access-Control-Request-Headers': 'X-Bar'
    }
  };
  return roi.get(options)
    .then(response => {
      expect(response.headers['access-control-allow-methods']).toBe(undefined);
      server.close();
    }).catch(e => {
      console.error(e);
      server.close();
    });
});

test('GET - login', () => {
  expect.assertions(1);
  const server = FakeAuthServer.create();
  const options = {
    endpoint: 'http://localhost:3005',
    username: 'admin',
    password: 'admin'
  };

  return roi.get(options)
  .then(result => {
    expect(result.body).toBe('admin - logged.');
    server.close();
  }).catch(e => {
    console.error(e);
    server.close();
  });
});

test('GET - Unauthorized', () => {
  expect.assertions(1);
  const server = FakeAuthServer.create();
  const options = {
    endpoint: 'http://localhost:3005',
    username: 'foo',
    password: 'bar'
  };

  return roi.get(options)
    .then(response => {
      console.log('Should not have succeeded.');
    })
    .catch(e => {
      expect(e.toString()).toBe('401 Unauthorized');
      server.close();
    });
});
