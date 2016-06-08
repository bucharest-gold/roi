// author: helio frota.

'use strict';

const test = require('tape');
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

  roi.del('/posts/11')
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));

});

test('Should post.', t => {

  let foo = {
    title: "foo-json-server",
    author: "Panther-JS"
  };

  roi.post('/posts', foo)
    .then(x => {
      t.equal(x.statusCode, 201);
      t.end();
    }).catch(e => console.log(e));

});

test('Should put.', t => {

  let foo = {
    title: "hail-json-server",
    author: "Panther-JS"
  };

  roi.put('/posts/1', foo)
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));

});

test('teardown', t => {
  console.log('done.');
  t.end();
});