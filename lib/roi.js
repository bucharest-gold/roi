'use strict';

const RoiGet = require('./get');
const RoiPost = require('./post');
const RoiPut = require('./put');
const RoiDelete = require('./delete');
const RoiHead = require('./head');
const RoiDownload = require('./download');
const RoiUpload = require('./upload');
const RoiPostStream = require('./post-stream');

function get (options) {
  return new RoiGet().execute(options);
}

function post (options) {
  return new RoiPost().execute(options);
}

function put (options) {
  return new RoiPut().execute(options);
}

function del (options) {
  return new RoiDelete().execute(options);
}

function head (options) {
  return new RoiHead().execute(options);
}

function download (options, file) {
  return new RoiDownload().execute(options, file);
}

function upload (options, file) {
  return new RoiUpload().execute(options, file);
}

function postStream (options, file) {
  return new RoiPostStream().execute(options, file);
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
