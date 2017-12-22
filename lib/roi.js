'use strict';

const RoiGet = require('./get');
const RoiPost = require('./post');
const RoiPut = require('./put');
const RoiDelete = require('./delete');
const RoiHead = require('./head');
const RoiDownload = require('./download');
const RoiUpload = require('./upload');
const RoiPostStream = require('./post-stream');

const checkOptions = (options) => {
  if (typeof options === 'string') {
    return {endpoint: options};
  }
  return options;
};

function get (options) {
  options = checkOptions(options);
  return new RoiGet().execute(options);
}

function post (options, data) {
  options = checkOptions(options);
  return new RoiPost().execute(options, data);
}

function put (options, data) {
  options = checkOptions(options);
  return new RoiPut().execute(options, data);
}

function del (options) {
  options = checkOptions(options);
  return new RoiDelete().execute(options);
}

function head (options) {
  options = checkOptions(options);
  return new RoiHead().execute(options);
}

function download (options, file) {
  options = checkOptions(options);
  return new RoiDownload().execute(options, file);
}

function upload (options, file) {
  options = checkOptions(options);
  return new RoiUpload().execute(options, file);
}

function postStream (options, data, file) {
  options = checkOptions(options);
  return new RoiPostStream().execute(options, data, file);
}

module.exports = {
  get: get,
  post: post,
  put: put,
  del: del,
  head: head,
  download: download,
  upload: upload,
  postStream: postStream
};
