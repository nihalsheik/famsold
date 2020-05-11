/**
 * Created by sheik on 05-12-2015.
 */
var mysql = require('mysql');
var config = require('./conf/config.json');

var pool = mysql.createPool(config.db);

setInterval(testIt, 1000);

function testIt() {
  pool.getConnection(function(err, con) {
    con.query('select id from ledger limit 0,1', function(err, result) {
      console.log('connected as id ' + con.threadId);
      console.log('*****************************>', pool._allConnections.length);
      console.log(result);
      con.release();
      con.query('select id from ledger limit 0,1', function(err, result) {
        console.log(result);
      });
    });
  });
}