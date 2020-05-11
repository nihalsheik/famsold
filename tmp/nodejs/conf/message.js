/**
 * Created by sheik on 20-02-2016.
 */

var msg = require('./message.json');

exports.get = function(key, defVal) {
  return msg[key];
}