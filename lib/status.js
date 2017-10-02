'use strict';

// see: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
class Status {

  static notFound (code) {
    return code === 404;
  }

  static redirection (code) {
    return code >= 300 && code < 400;
  }

  static success (code) {
    return code >= 200 && code < 300;
  }

  static clientError (code) {
    return code >= 400 && code < 500;
  }

  static serverError (code) {
    return code >= 500;
  }

  static ok (code) {
    return (Status.success(code) &&
           !Status.clientError(code) &&
           !Status.serverError(code) &&
           !Status.redirection(code)) ||
           Status.notFound(code);
  }
}

module.exports = Status;
