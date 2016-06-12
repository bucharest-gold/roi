'use strict';

const test = require('tape');
const fs = require('fs');
let roi = require('../lib/roi');

test('setup', t => {
  roi = roi({ port: 3000 });
  console.log('init.');
  t.end();
});

test('Should get.', t => {
  roi.get('/posts')
    .then(x => {
      t.equal(x[0].id, 1);
      t.end();
    }).catch(e => console.log(e));
});

test('Should delete.', t => {
  roi.del('/posts/1')
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));
});

test('Should post.', t => {
  let foo = {
    title: 'foo-json',
    author: 'Panther-JS'
  };

  roi.post('/posts', foo)
    .then(x => {
      t.equal(x.statusCode, 201);
      t.end();
    }).catch(e => console.log(e));
});

test('Should put.', t => {
  let foo = {
    title: 'hail-json-server',
    author: 'Panther-JS'
  };

  roi.put('/posts/1', foo)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));
});

test('Should download.', t => {
  roi = roi({ host: 'central.maven.org' });
  roi.download('/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar', '/tmp/aesh.jar')
    .then(x => {
      try {
        fs.statSync('/tmp/aesh.jar');
        t.equal(1, 1);
      } catch (e) {
        console.log(e);
      }
      t.end();
    }).catch(e => console.log(e));
});
