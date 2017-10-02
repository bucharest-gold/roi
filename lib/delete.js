'use strict';

const Base = require('./base');

class RoiDelete extends Base {
  execute (options) {
    options.method = 'DELETE';
    return this.action(options);
  }
}

module.exports = RoiDelete;
