'use strict';

class ResponseHandler {

  static handle (body, response) {
    return {
      'statusCode': response.statusCode,
      'headers': response.headers,
      'body': body
    };
  }
}

module.exports = ResponseHandler;
