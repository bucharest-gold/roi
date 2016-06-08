'use strict';

let roi = require('./lib/roi');

let opts = {
  port:8080,
  username: 'admin',
  password: 'admin123!'
};

roi(opts).get('/apiman/system/status/')
.then(x => console.log(x))
.catch(e => console.log(e));