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

let http = require('http');
const fs = require('fs');

const roi = (options) => {
  if (options.https === true) {
    http = require('https');
  }

  const usr = options.username || '';
  const passwd = options.password || '';

  const auth = () => {
    if (usr) {
      return 'Basic ' + new Buffer(usr + ':' + passwd).toString('base64');
    }
    return '';
  };

  let opts = {
    'hostname': options.host || 'localhost',
    'port': options.port || '80',
    'path': options.url || '/',
    'method': 'GET',
    'headers': {
      'Accept': 'application/json,text/plain',
      'Content-type': 'application/json',
      'Authorization': auth()
    }
  };

  const checkStatusCode = (reject, response) => {
    const code = response.statusCode;
    if (code === 404) {
      reject(new Error(`[${code}] - The requested resource could not be found.`));
    } else if (code === 405) {
      reject(new Error(`[${code}] - A request method is not supported for the requested resource.`));
    } else if (code === 415) {
      reject(new Error(`[${code}] - The request entity has a media type which the server or resource does not support.`));
    }
  };

  const get = (url) => {
    opts.path = url;
    return new Promise((resolve, reject) => {
      http.get(opts, response => {
        checkStatusCode(reject, response);
        let body = [];
        response.setEncoding('utf8');
        response.on('data', d => body.push(d));
        response.on('end', () => resolve(JSON.parse(body)));
      }).on('error', e => reject(e));
    });
  };

  const post = (url, data) => {
    let dt = JSON.stringify(data);
    opts.path = url;
    opts.method = 'POST';
    opts.headers['Content-Length'] = dt.length;
    return new Promise((resolve, reject) => {
      let req = http.request(opts, (response) => {
        checkStatusCode(reject, response);
        response.on('data', () => (''));
        response.on('end', () => resolve(response));
      }).on('error', e => reject(e));
      req.write(dt);
      req.end();
    });
  };

  const put = (url, data) => {
    let dt = JSON.stringify(data);
    opts.path = url;
    opts.method = 'PUT';
    opts.headers['Content-Length'] = dt.length;
    return new Promise((resolve, reject) => {
      let req = http.request(opts, (response) => {
        checkStatusCode(reject, response);
        response.on('data', () => (''));
        response.on('end', () => resolve(response));
      }).on('error', e => reject(e));
      req.write(dt);
      req.end();
    });
  };

  const del = (url) => {
    opts.path = url;
    opts.method = 'DELETE';
    return new Promise((resolve, reject) => {
      let req = http.request(opts, (response) => {
        checkStatusCode(reject, response);
        response.on('data', () => (''));
        response.on('end', () => resolve(response));
      }).on('error', e => reject(e));
      req.end();
    });
  };

  const download = (url, file) => {
    opts.path = url;
    return new Promise((resolve, reject) => {
      let stream = fs.createWriteStream(file);
      http.get(opts, response => {
        checkStatusCode(reject, response);
        response.pipe(stream);
        stream.on('finish', () => {
          resolve(response);
          stream.close();
        });
      }).on('error', e => reject(e));
    });
  };

  const exists = (url) => {
    opts.path = url;
    opts.method = 'HEAD';
    return new Promise((resolve, reject) => {
      let req = http.request(opts, (response) => {
        checkStatusCode(reject, response);
        response.on('data', () => (''));
        response.on('end', () => resolve(response));
      }).on('error', e => reject(e));
      req.end();
    });
  };

  return Object.freeze({
    del: del,
    download: download,
    get: get,
    exists: exists,
    post: post,
    put: put
  });
};

module.exports = roi;
