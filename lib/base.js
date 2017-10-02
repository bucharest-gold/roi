'use strict';

const OptionHandler = require('./option-handler');
const ResponseHandler = require('./response-handler');
const Status = require('./status');

class Base {
  constructor () {
    this.redirects = 0;
    this.maxRedirects = 3;
  }

  action (options) {
    options = OptionHandler.setup(options);
    options = OptionHandler.addHeaders(options);
    return new Promise((resolve, reject) => {
      const req = options.proto.request(options, (response) => {
        let body = [];
        response.setEncoding('utf8');
        response.on('data', d => body.push(d));
        const statusCode = response.statusCode;
        if (Status.ok(statusCode)) {
          response.on('end', () => {
            body = body.join('');
            resolve(ResponseHandler.handle(body, response));
          });
        } else if (Status.clientError(statusCode) || Status.serverError(statusCode)) {
          reject(body);
        } else if (Status.redirection(statusCode)) {
          options.endpoint = response.headers.location;
          this.redirects++;
          if (this.redirects >= this.maxRedirects) {
            const errorMessage = `Maximum redirects reached. (Amount of redirects allowed: ${this.redirects})`;
            this.redirects = 0;
            return reject(new Error(errorMessage));
          }
          resolve(this.action(options));
        }
      });
      req.on('error', (e) => reject(e));
      req.end();
    });
  }

  actionData (options, data) {
    data = data || {};
    options = OptionHandler.setup(options);
    const jsonData = JSON.stringify(data);
    options = OptionHandler.addHeaders(options);
    options.headers['Content-Length'] = jsonData.length;
    return new Promise((resolve, reject) => {
      const req = options.proto.request(options, (response) => {
        let body = [];
        response.setEncoding('utf8');
        response.on('data', d => body.push(d));
        const statusCode = response.statusCode;
        if (Status.ok(statusCode)) {
          response.on('end', () => {
            body = body.join('');
            resolve(ResponseHandler.handle(body, response));
          });
        } else if (Status.clientError(statusCode) || Status.serverError(statusCode)) {
          reject(body);
        } else if (Status.redirection(statusCode)) {
          options.endpoint = response.headers.location;
          this.redirects++;
          if (this.redirects >= this.maxRedirects) {
            const errorMessage = `Maximum redirects reached. (Amount of redirects allowed: ${this.redirects})`;
            this.redirects = 0;
            return reject(new Error(errorMessage));
          }
          resolve(this.actionData(options, data));
        }
      });
      req.on('error', (e) => reject(e));
      req.write(jsonData);
      req.end();
    });
  }
}

module.exports = Base;
