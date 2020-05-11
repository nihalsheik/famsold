/**
 * Created by admin on 27-08-2015.
 */

var assert = require("assert");
var config = require('../conf/config.json');
var util = require('../helpers/util');
var needle = require('needle');
var color = require('mocha').reporters.Base.color;

var baseUrl = config.apiUrl;
var option = {headers: {'content-type': 'applicatoin/json'}};

var envVars = {};

exports.it = function(label, callback) {
  var self = this;
  return it(label, function(done) {
    var itSelf = this;
    callback.apply(this, [
      function() {
        itSelf.test.req.callback = itSelf.test.req.callback || done;
        self.makeReq.call(null, itSelf.test);
      },
      function() {
        done();
      }]);
  });
};

exports.it2 = function(label, callback) {
  var that = this;
  return it(label, function(next) {
    callback.call(this, next);
    this.test.req = this.test.req || {};
    this.test.req.callback = this.test.req.callback || next;
    that.makeReq.call(that, this.test);
  });
};

exports.setVar = function(key, value) {
  envVars[key] = value;
};
exports.getVar = function(key, value) {
  return envVars[key];
};

exports.makeReq = function(test) {

  var obj = test.req || {};

  var url = obj.url || '';
  var method = obj.method || 'get';
  var payload = obj.payload || null;
  var opt = util.merge(option, obj.option);
  obj.expect = obj.expect || {status: 200};

  test.req.url = url;
  test.req.headers = opt;
  needle.request(method, baseUrl + url, payload, opt, function(err, res) {

    if ((err != null && err.code == 'ECONNREFUSED') || !res || res == null || res === 'undefined') {
      console.log('**** SERVER NOT RUNNING ****');
      process.exit();
      return;
    }

    if (err) {
      test.err = err;
      obj.callback.apply(null, [err, null]);
      return assert.fail(err);
    }

    test.res = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers,
      body: res.body
    };

    test.result = 'Status : ' + res.statusCode;
    assert.equal(res.statusCode, obj.expect.status);

    //-----------------------------------------------//
    if (obj.callback && obj.callback instanceof Function) {
      obj.callback.apply(null, [err, res]);
    }

  });

};
