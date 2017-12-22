'use strict';

const Base = require('./base');

class RoiPut extends Base {
  execute (options, data) {
    options.method = 'PUT';
    return this.actionData(options, data);
  }
}

module.exports = RoiPut;
