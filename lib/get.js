'use strict';

const Base = require('./base');

class RoiGet extends Base {
  execute (options) {
    return this.action(options);
  }
}

module.exports = RoiGet;
