process.env.NODE_ENV = 'TEST';

argv = process.argv;
var files = [];
if (argv.length == 3) {
  files.push(argv[2]);
} else {
  files = [
    'test_ledger_group.js',
    '-test_basic1.js',
    'test_unit.js',
    'test_inv.js',
    'test_voucher_type.js',
    '-test_ledger.js'
  ];
}

var Mocha = require('mocha');
var fs = require('fs');
var config = require('../conf/config.json');
var Base = require('../node_modules/mocha/lib/reporters/base');
var needle = require('needle');
var cursor = Base.cursor;
var color = Base.color;

var mocha = new Mocha({
  ui: "bdd",
  timeout: 60000,
  slow: 10000,
  reporter: __dirname + '/reporters/json.js'
});

console.log('Files to test : ');

files.forEach(function(file, i) {
  var path = __dirname + '/' + file;
  console.log(color('pass', '    %s. %s'), i + 1, file);
  if (fs.existsSync(path)) {
    mocha.addFile(path);
  }
});

(function() {
  needle.get(config.apiUrl + '/ping', function(err, res) {
      if ((err != null && err.code == 'ECONNREFUSED') || !res || res == null || res === 'undefined') {
        console.log('**** SERVER NOT RUNNING ****');
        process.exit();
      } else {
        runTest();
      }
    }
  );
})();

function runTest() {
  var runner = mocha.run(function() {
    console.log('DONE');
    process.exit();
  });
}
