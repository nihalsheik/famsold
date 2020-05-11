var DB = require('../models/db');

//var tables = [
//  'voucher_item',
//  'voucher',
//  'ledger',
//  'inventory_item',
//  'unit'
//];

var tables = [
  'inventory_item',
  'unit'
];

describe("Cleaning Database", function() {

  var con;
  var db = new DB();

  before(function(done) {
    db.getConnection(function(err, conn) {
      con = conn;
      done();
    });
  });

  tables.forEach(function(table) {
    it('Clean table : ' + table, function(next) {
      con.query('DELETE FROM ' + table + ';ALTER TABLE ' + table + ' AUTO_INCREMENT = 1;', function(err, result) {
        next();
      })
    });
  });

  after(function(done) {
    db.clean();
    done();
  })

});
