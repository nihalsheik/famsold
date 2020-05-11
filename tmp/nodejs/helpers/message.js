/**
 * Created by Sheik on 06-08-2015.
 */

var msg = require('../conf/message.json');
var util = require('util');

module.exports = new function() {

  /**
   *
   * @param code
   * @param args
   * If you use field in message( ${xxx} ), then it will be replace with args
   * @returns {*}
   */
  this.get = function(code, args) {

    /**
     * Cloning from original object, otherwise it will change the original message
     * if you even change the copy of variable
     */
    var t = msg[code];
    if (!t) {
      return '';
    }

    var m = util._extend({}, msg[code]);

    m.code = code;

    if (args && typeof args === 'object') {
      m.message = m.message.replace(/\${.*}/gm, function(v) {
        var f = v.substr(2, v.length - 3);
        if (args[f]) {
          return args[f];
        }
        return '';
      });
      if (args._addMessage) {
        m.message += args._addMessage;
      }
    } else {
      m.message = m.message.replace(/\${.*}/gm, '');
    }

    return m;
  };

};