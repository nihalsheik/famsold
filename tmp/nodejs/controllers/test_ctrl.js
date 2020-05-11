/**
 * Created by sheik on 26-09-2015.
 */

var fs = require('fs');

exports.getResult = function(req, res) {

  var filePath = __dirname + '/../test/results/result.json';

  var data = {suites: []};

  if (fs.existsSync(filePath)) {
    var content = fs.readFileSync(filePath).toString();
    data = JSON.parse(content) || {};
  }

  if (req.query.format == 'json') {
    return res.json(data).end();
  }

  var stitle = [];

  var st = data.stats || {tests: 0, passes: 0, pending: 0, failures: 0, duration: 0};

  var slNo = 1;

  var html = '<link rel="stylesheet" href="/results/css/default.css" />';
  html += '<link rel="stylesheet" href="/results/css/nswindow/nswindow.css" />';
  html += '<link rel="stylesheet" href="/results/css/jsoneditor.css" />';
  html += '<script type="text/javascript" src="/results/js/jquery-2.1.1.min.js"></script>';
  html += '<script type="text/javascript" src="/results/js/jquery.easing.js"></script>';
  html += '<script type="text/javascript" src="/results/js/nswindow.js"></script>';
  html += '<script type="text/javascript" src="/results/js/default.js"></script>';
  html += '<script type="text/javascript" src="/results/js/jsoneditor.min.js"></script>';
  html += '<div align="center">';
  html += '<div class="container">';
  html += '<div class="logo"></div>';
  html += '<div class="head">Cloud API - V2 - Test Result</div>';
  html += '<table class="summary"><tr>';

  var h = [
    ['Tests', 'tests'],
    ['Passes', 'passes'],
    ['Failures', 'failures'],
    ['Response Failure', 'responseFailure'],
    ['Duration', 'duration']
  ];

  h.forEach(function(t, index) {
    html += '<td><div class="statsWidget widget' + t[1] + '">';
    if (index > 0 && index < 4 && parseInt(st[t[1]]) > 0) {
      html += '<div class="selector selected" title="Click here to filter"></div>';
    }
    html += '<div class="title">' + t[0] + '</div>';
    html += '<div class="content">' + st[t[1]] + '</div>';
    html += '</div></td>';

    if (index < 4) {
      html += '<td class="sep">&nbsp;</td>';
    }
  });
  html += '</tr></table>';
  html += '<div class="toolbar"><table border="0"><tr>';
  html += '<td><select class="suiteList">';
  data.suites.forEach(function(suite) {
    html += '<option id="' + suite.id + '">' + suite.title + '</option>';
  });
  html += '</select></td>';

  html += '<td><button id="btnCollapse" class="collapse-all" title="Collapse all fields"></button></td>';
  html += '<td><button id="btnExpand" class="expand-all" title="Expand all fields"></button></td>';
  html += '</tr></table></div>';

  html += '<table border="1" class="test" id="testTable">';

  html += '<tr class="testRow header">';
  html += '<td>SL.No</td>';
  html += '<td>Title</td>';
  html += '<td>Expected<br/>Status</td>';
  html += '<td>Actual<br/>Status</td>';
  html += '<td>Duration</td>';
  html += '<td>Response</td>';
  html += '<td>Status</td>';
  html += '</tr>';

  parseSuite(data.suites);

  html += '</table></br>';
  html += '<div class="copyright">Copyright (c) : Energous Team</div>';
  html += '</div>';
  html += '</div>';

  res.contentType('text/html').send(html).end();

  function parseSuite(suites) {
    if (suites.length == 0) {
      return;
    }
    suites.forEach(function(suite) {
      stitle.push(suite.title);
      parseTest(suite.tests);
      parseSuite(suite.suites);
      stitle.splice(stitle.length - 1, 1);
    });

  }

  function parseTest(tests) {

    if (tests.length == 0) {
      return;
    }

    html += '<tr class="suiteRow"><td colspan="7">' + stitle.join(' > ') + '</td></tr>';

    tests.forEach(function(test) {

      html += '<tr class="testRow response-' + test.hasResponseChanged + ' ' + test.state + '" data-id="' + test.id + '">';
      html += '<td class="slno">' + slNo++ + '</td>';
      html += '<td>' + test.title + '</td>';
      html += '<td class="result">' + test.statusExpect + '</td>';
      html += '<td class="result">' + test.statusCode + '</td>';
      html += '<td class="duration">' + (test.duration === undefined ? '' : test.duration) + ' ms</td>';
      html += '<td class="response"></td>';
      html += '<td class="status"></td>';
      html += '</tr>';

    });

  }

};

exports.getDetail = function(req, res) {
  var id = req.query.id;

  var filePath = __dirname + '/../test/results/result_detail.json';

  var content = {};

  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath).toString();
    content = JSON.parse(content) || {};
  }

  var result = {};
  if (content.hasOwnProperty(id)) {
    result = content[id];
  }
  res.json(result);
};

exports.runTest = function(req, res) {
  var spawn = require('child_process').spawn;

  var ls = spawn('node', ['./test/test.js']);

  ls.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });

  ls.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
  });

  ls.on('error', function (err) {
    res.send('error');
  });

  ls.on('close', function(code) {
    console.log('child process exited with code ' + code);
    res.send(code);
  });

};