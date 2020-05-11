/**
 * Module dependencies.
 */

// node node_modules\mocha\bin\_mocha --ui bdd --reporter "../../../test/reporters/json"

var Base = require('../../node_modules/mocha/lib/reporters/base')
  , cursor = Base.cursor
  , color = Base.color;
var fs = require('fs');

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
  var testId = 0, suiteId = 0, respFailure = 0;
  var testDetails = {};
  var indents = 0, resChanged = 0, fail = 0;

  runner.on('test end', function(test) {
    var res = test.res || {};
    if (res.hasResponseChanged == true) {
      resChanged++;
    }
  });

  runner.on('start', function() {
    console.log();
  });

  runner.on('suite', function(suite) {
    ++indents;
    console.log(color('bright yellow', '%s%s'), indent(), suite.title);
    console.log(color('bright yellow', '%s%s'), indent(), Array(suite.title.length + 1).join('-'));
  });

  runner.on('suite end', function(suite) {
    --indents;
    if (1 == indents) console.log();
  });

  runner.on('pending', function(test) {
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test) {

    var res = test.res || {};
    var fmt = indent();
    if (res.hasResponseChanged == true) {
      fmt += color('checkmark', '  ') + color('bright yellow', '! %s');
    } else {
      fmt += color('checkmark', '  ' + Base.symbols.ok) + color('pass', ' %s');
    }
    fmt += color(test.speed, ' (%d ms)');
    cursor.CR();
    console.log(fmt, test.title, test.duration);

  });

  runner.on('fail', function(test, err) {
    cursor.CR();
    console.log(indent() + color('fail', '  %d) %s'), ++fail, test.title);
  });

  runner.on('end', function() {
    var stats = self.stats;
    stats.responseChanged = resChanged;
    console.log(color('bright yellow', 'TEST SUMMARY'));
    console.log(color('bright yellow', '--------------------------------------'));
    console.log(color('bright yellow', '  Suites       : %s'), stats.suites);
    console.log(color('bright yellow', '  Tests        : %s'), stats.tests);
    console.log(color('bright yellow', '  Passes       : %s'), stats.passes);
    console.log(color('bright yellow', '  Failures     : %s'), stats.failures);
    console.log(color('bright yellow', '  Duration     : %s ms'), stats.duration);
    console.log(color('bright yellow', '  Resp Error   : %s'), resChanged);
    console.log(color('bright yellow', '--------------------------------------'));

    var result = iterateSuite(runner.suite);
    result.stats = stats;
    result.stats.responseFailure = respFailure;
    runner.testResults = result;

    var fd = fs.openSync(__dirname + '/../results/result_summary.json', 'w');
    fs.writeSync(fd, JSON.stringify(result.stats, null, 2));
    fs.closeSync(fd);

    var fd = fs.openSync(__dirname + '/../results/result.json', 'w');
    fs.writeSync(fd, JSON.stringify(result, null, 2));
    fs.closeSync(fd);

    var fd2 = fs.openSync(__dirname + '/../results/result_detail.json', 'w');
    fs.writeSync(fd, JSON.stringify(testDetails, null, 2));
    fs.closeSync(fd2);

  });

  function iterateSuite(suite) {
    suiteId++;
    var s = {
      id: suiteId,
      title: suite.title,
      root: suite.root,
      file: suite.file,
      duration: 0,
      suites: [],
      tests: []
    };

    var duration = 0;
    suite.tests.forEach(function(t) {
      duration += t.duration;
      s.tests.push(iterateTests(t));
    });

    s.duration = duration;

    suite.suites.forEach(function(ts) {
      var s2 = iterateSuite(ts);
      s.duration += s2.duration;
      s.suites.push(s2);
    });

    return s;
  }

  function iterateTests(test) {
    testId++;
    var req = test.req || {};
    var res = test.res || {};
    testDetails[testId] = {req: req, res: res};
    var exp = req.expect || {};
    var res = test.res || {};
    if (res.hasResponseChanged == true) {
      respFailure++;
    }
    return {
      id: testId,
      title: test.title,
      fullTitle: test.fullTitle(),
      duration: test.duration,
      speed: test.speed,
      state: test.state,
      sync: test.sync,
      timeOut: test.timeOut,
      statusExpect: exp.status || 200,
      statusCode: res.statusCode || '',
      statusMessage: res.statusMessage || '',
      hasResponseChanged: res.hasResponseChanged,
      err: errorJSON(test.err || {})
    }
  }

  function indent() {
    return Array(indents).join('  ')
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
}


