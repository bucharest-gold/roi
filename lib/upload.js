'use strict';

const fs = require('fs');
const Base = require('./base');
const OptionHandler = require('./option-handler');
const ResponseHandler = require('./response-handler');
const Status = require('./status');

class RoiUpload extends Base {
  execute (options, file) {
    options = OptionHandler.setup(options);
    options = OptionHandler.addHeaders(options);
    options.method = 'POST';
    options.headers.filename = file;
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
          resolve(this.execute(options, file));
        }
      });
      req.on('error', (e) => reject(e));
      const stream = fs.ReadStream(file);
      stream.pipe(req);
      stream.on('close', (res) => {
        req.end();
      });
    });
  }

}

module.exports = RoiUpload;
