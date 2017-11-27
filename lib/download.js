'use strict';

const fs = require('fs');
const Base = require('./base');
const OptionHandler = require('./option-handler');
const Status = require('./status');

class RoiDownload extends Base {
  execute (options, file) {
    options = OptionHandler.setup(options);
    options = OptionHandler.addHeaders(options);
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(file);
      const req = options.proto.request(options, (response) => {
        const statusCode = response.statusCode;
        if (Status.ok(statusCode)) {
          response.pipe(stream);
          stream.on('finish', () => {
            resolve(response);
            stream.end();
          });
        } else {
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
      req.end();
    });
  }

}

module.exports = RoiDownload;
