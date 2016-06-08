// author: helio frota.

'use strict';

const http = require('http');

const roi = (options) => {

  const usr = options.username || '';
  const passwd = options.password || '';

  const auth = () => {
    if (usr) {
      return { 'Authorization': 'Basic ' + new Buffer(usr + ':' + passwd).toString('base64') };
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
    },
    'auth': auth()
  };

  const checkStatusCode = (rej, resp) => {
    let code = resp.statusCode;
    if (code === 404) {
      rej(new Error(`[${code}] - The requested resource could not be found.`));
    } else if (code === 405) {
      rej(new Error(`[${code}] - A request method is not supported for the requested resource.`));
    } else if (code === 415) {
      rej(new Error(`[${code}] - The request entity has a media type which the server or resource does not support.`));
    }
  };

  const get = (url) => {
    opts.path = url;
    return new Promise((res, rej) => {
      http.get(opts, resp => {
        checkStatusCode(rej, resp);
        let body = [];
        resp.setEncoding('utf8');
        resp.on('data', d => body.push(d));
        resp.on('end', () => res(JSON.parse(body)));
      }).on('error', e => rej(e));
    });
  };

  const post = (url, data) => {
    let dt = JSON.stringify(data);
    opts.path = url;
    opts.method = 'POST';
    opts.headers['Content-Length'] = dt.length;
    return new Promise((res, rej) => {
      let req = http.request(opts, (resp) => {
        checkStatusCode(rej, resp);
        resp.on('data', () => (''));
        resp.on('end', () => res(resp));
      }).on('error', e => rej(e));
      req.write(dt);
      req.end();
    });
  };

  const put = (url, data) => {
    let dt = JSON.stringify(data);
    opts.path = url;
    opts.method = 'PUT';
    opts.headers['Content-Length'] = dt.length;
    return new Promise((res, rej) => {
      let req = http.request(opts, (resp) => {
        checkStatusCode(rej, resp);
        resp.on('data', () => (''));
        resp.on('end', () => res(resp));
      }).on('error', e => rej(e));
      req.write(dt);
      req.end();
    });
  };

  const del = (url) => {
    opts.path = url;
    opts.method = 'DELETE';
    return new Promise((res, rej) => {
      let req = http.request(opts, (resp) => {
        checkStatusCode(rej, resp);
        resp.on('data', () => (''));
        resp.on('end', () => res(resp));
      }).on('error', e => rej(e));
      req.end();
    });
  };

  return Object.freeze({
    get,
    post,
    put,
    del
  });

};

module.exports = roi;