/**
 * Module dependencies.
 */

// node node_modules\mocha\bin\_mocha --ui bdd --reporter "../../../test/reporters/json"

var Base = require('../../node_modules/mocha/lib/reporters/base');
var fs = require('fs');

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var html = '';
  var slNo = 1;
  //var argv = process.argv;
  //console.log('arguments' ,argv);

  runner.on('start', function() {
    html += '<table border="1" class="test">';
  });

  runner.on('suite', function(suite) {
    if (suite.root == true) {
      return;
    }
    html += '<tr><td colspan="4" class="suite">' + suite.title + '</td></tr>';
  });

  runner.on('test end', function(test) {
    html += '<tr class="' + test.state + '">';
    html += '<td class="slno">' + slNo++ + '</td>';
    html += '<td>' + test.title + '</td>';
    //html += '<table class="detail"><tr><td><pre>' + JSON.stringify(test.req,null,2) +
    //  '</pre></td><td><pre>' + JSON.stringify(test.res,null,2) + '</pre></td></tr></table>';
    html += '</td>';
    html += '<td class="duration">' + (test.duration === undefined ? '' : test.duration) + ' ms</td>';
    html += '<td class="status"></td>';
    html += '</tr>';
  });

  runner.on('suite end', function(test) {
  });

  runner.on('end', function() {
    html += '</table>';

    var st = self.stats;

    var summary = '<link rel="stylesheet" href="default.css" />';
    summary += '<div align="center">';
    summary += '<div class="logo"></div>';
    summary += '<div class="head">Cloud API - Test Result</div>';
    summary += '<table class="summary"><tr>';
    summary += '<td>Suites : ' + st.suites + '</td>';
    summary += '<td>Tests : ' + st.tests + '</td>';
    summary += '<td>Passed : ' + st.passes + '</td>';
    summary += '<td>Pending : ' + st.pending + '</td>';
    summary += '<td>Failures : ' + st.failures + '</td>';
    summary += '<td>Duration : ' + st.duration + '</td>';
    summary += '</tr></table></br>';
    summary += html;
    summary += '<div class="copyright">Copyright (c) : Energous Team</div>';
    summary += '</div>';
    //runner.testResults = html;

    var fd = fs.openSync(__dirname + '/../results/index.html', 'w');
    fs.writeSync(fd, summary);
    fs.closeSync(fd);

  });

}

/**
 * Transform `error` into a JSON object.
 * @param {Error} err
 * @return {Object}
 */

function errorJSON(err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function(key) {
    res[key] = err[key];
  }, err);
  return res;
}
