'use strict';

const Base = require('./base');

class RoiHead extends Base {
  execute (options) {
    options.method = 'HEAD';
    return this.action(options);
  }
}

module.exports = RoiHead;
