/**
 * Created by sheik on 06-12-2015.
 */

var msg = require('../conf/message.json');

var ApiError = function(args) {

  this.code = '';
  this.message = '';
  this.status = 400;
  this.type = 'error';

  var obj = {};

  if (args instanceof Error) {
    this.code = args.code;
    this.name = args.name;
    this.message = args.message;

  } else if (typeof args === 'number') {

    this.code = args;
    obj = msg[args];

  } else if (typeof args === 'string') {

    this.message = args;

  } else if (typeof args === 'object') {

    obj = args;

  }

  obj = obj || {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      this[key] = obj[key];
    }
  }

};

ApiError.prototype = new Error();

module.exports = ApiError;
