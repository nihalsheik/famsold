var mysql = require('mysql');
var conn = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: 'root',
  password: 'welcome01',
  database: 'ac'
});

describe("Database", function() {

  before(function(next) {
    console.log('Cleaning database');
    conn.connect();

    var sql = 'DELETE FROM voucher_item;' +
      'DELETE FROM voucher;' +
      'DELETE FROM ledger;' +
      'ALTER TABLE ledger AUTO_INCREMENT = 1;';

    conn.query(sql, function(err, res) {
      next();
    });
  });

  it('Clearing data', function(next){
    console.log('done');
    next();
  });

  after(function(next) {
    console.log('Disconnecting database.');
    conn.end();
    next();
  });

});