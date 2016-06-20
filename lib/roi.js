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

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');

let Http = http;

const roi = (options) => {
  if (options.https === true) {
    Http = https;
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

  let urlOnly = false;
  if (typeof options === 'string') {
    try {
      const parsedUrl = url.parse(options);
      opts.hostname = parsedUrl.hostname;
      opts.port = parsedUrl.port;
      opts.path = parsedUrl.path;
      if (parsedUrl.protocol === 'https:') {
        Http = https;
      }
      urlOnly = true;
    } catch (e) {
      console.log(e.message);
      throw new TypeError('URL cannot be parsed.' + options);
    }
  }

  const checkStatusCode = (reject, response) => {
    const code = response.statusCode;
    if (code >= 400) {
      reject(new Error(`[${code}] - ${response.statusMessage}`));
    }
    return code < 400;
  };

  const checkUsingUrlOnly = (url) => {
    if (!urlOnly) {
      opts.path = url;
      return false;
    }
    return true;
  };

  const get = (url) => {
    checkUsingUrlOnly(url);
    return new Promise((resolve, reject) => {
      Http.get(opts, response => {
        if (checkStatusCode(reject, response)) {
          let body = [];
          response.setEncoding('utf8');
          response.on('data', d => body.push(d));
          response.on('end', () => resolve(JSON.parse(body)));
        }
      }).on('error', e => reject(e));
    });
  };

  const post = (url, data) => {
    let dt = JSON.stringify(data);
    opts.path = url;
    opts.method = 'POST';
    opts.headers['Content-Length'] = dt.length;
    return new Promise((resolve, reject) => {
      let req = Http.request(opts, (response) => {
        if (checkStatusCode(reject, response)) {
          response.on('data', () => (''));
          response.on('end', () => resolve(response));
        }
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
      let req = Http.request(opts, (response) => {
        if (checkStatusCode(reject, response)) {
          response.on('data', () => (''));
          response.on('end', () => resolve(response));
        }
      }).on('error', e => reject(e));
      req.write(dt);
      req.end();
    });
  };

  const del = (url) => {
    checkUsingUrlOnly(url);
    opts.method = 'DELETE';
    return new Promise((resolve, reject) => {
      let req = Http.request(opts, (response) => {
        if (checkStatusCode(reject, response)) {
          response.on('data', () => (''));
          response.on('end', () => resolve(response));
        }
      }).on('error', e => reject(e));
      req.end();
    });
  };

  const download = (file, url) => {
    checkUsingUrlOnly(url);
    return new Promise((resolve, reject) => {
      let stream = fs.createWriteStream(file);
      Http.get(opts, response => {
        if (checkStatusCode(reject, response)) {
          response.pipe(stream);
          stream.on('finish', () => {
            resolve(response);
            stream.close();
          });
        }
      }).on('error', e => reject(e));
    });
  };

  const upload = (file, url) => {
    checkUsingUrlOnly(url);
    opts.method = 'POST';
    opts.headers.filename = file;
    return new Promise((resolve, reject) => {
      let req = http.request(opts, (response) => {
        const body = [];
        response.on('data', (chunk) => body.push(chunk));
        response.on('end', () => resolve(body.join('')));
      }).on('error', (error) => reject(error));

      let stream = fs.ReadStream(file);
      stream.pipe(req);
      stream.on('close', (res) => {
        req.end();
      });
    });
  };

  const exists = (url) => {
    checkUsingUrlOnly(url);
    opts.method = 'HEAD';
    return new Promise((resolve, reject) => {
      let req = Http.request(opts, (response) => {
        if (checkStatusCode(reject, response)) {
          response.on('data', () => (''));
          response.on('end', () => resolve(response));
        }
      }).on('error', e => reject(e));
      req.end();
    });
  };

  return Object.freeze({
    del: del,
    download: download,
    exists: exists,
    get: get,
    post: post,
    put: put,
    upload: upload
  });
};

module.exports = roi;
