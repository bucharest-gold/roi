/**
 * Copyright 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
const fs = require('fs');
const Roi = require('../lib/roi');

let roi = null;

test('setup', t => {
  roi = Roi({ port: 3000 });
  console.log('init.');
  t.end();
});

test('Should get.', t => {
  Roi('http://localhost:3000/posts').get()
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
  Roi('http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar')
  .download('/tmp/aesh.jar')
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

test('Should check if url exists.', t => {
  Roi('http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar').exists()
    .then(x => {
      t.equal(x.statusCode, 200);
      t.end();
    }).catch(e => console.log(e));
});
