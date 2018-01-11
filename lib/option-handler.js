'use strict';

const url = require('url');
const http = require('http');
const https = require('https');

class OptionHandler {

  static setup (options) {
    if (!options || !options.endpoint) {
      throw new Error('Endpoint url not specified. Use: const options = { endpoint: \'http://endpoint_here\' }');
    }
    url.parse(options.endpoint).protocol === 'http:' ? http : https;
    const parsed = url.parse(options.endpoint);
    options.hostname = parsed.hostname;
    options.port = parsed.port;
    options.path = parsed.path;
    options.proto = parsed.protocol === 'http:' ? http : https;
    return options;
  }

  static auth (options) {
    if (options.username) {
      return `Basic ${Buffer.from(`${options.username}:${options.password}`).toString('base64')}`;
    }
    return '';
  }

  static addHeaders (options) {
    if (options.noAuth) {
      options.headers = {
        'Accept': 'application/json,text/plain',
        'Content-type': 'application/json'
      };
      return options;
    }
    if (options.headers) {
      options.headers['Authorization'] = options.headers['Authorization'] || this.auth(options);
    } else {
      options.headers = {
        'Accept': 'application/json,text/plain',
        'Content-type': 'application/json',
        'Authorization': this.auth(options)
      };
    }
    return options;
  }

}

module.exports = OptionHandler;
