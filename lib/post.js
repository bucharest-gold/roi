'use strict';

const Base = require('./base');

class RoiPost extends Base {
  execute (options, data) {
    options.method = 'POST';
    return this.actionData(options, data);
  }
}

module.exports = RoiPost;
