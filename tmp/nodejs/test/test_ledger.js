var tm = require('./tm');
var T = require('./api_tester');
var db = require('../models/db');

describe("Ledger", function() {

  before(function(done) {
    db.getConnection(function(err, con) {
      con.query('DELETE FROM ledger;ALTER TABLE ledger AUTO_INCREMENT=1;', function(err, result) {
        db.clean(con);
        done();
      });
    });
  });

  var ledgers = [], index = 1;

  for (var key in tm.LEDGER) {
    if (tm.LEDGER.hasOwnProperty(key)) {
      ledgers.push(tm.LEDGER[key]);
    }
  }

  ledgers.forEach(function(ledger) {

    T.it2('Ledger for : ' + ledger.name, function(next) {
      this.test.req = {
        method: 'post',
        url: '/ledger',
        payload: ledger,
        callback: function(err, res) {
          T.setVar('lid' + index++, res.body.response.insertId);
          next();
        }
      };
    });

  });

  var request = [
    {name: '', groupId: 20},
    {name: 'asdfsdaf#$%%^&&*(', groupId: 20},
    {name: 'test', groupId: 155},
    {name: 'Cash A/c', groupId: 12},
    {name: 'Cash A/c2'}
  ];

  request.forEach(function(ledger) {
    T.it2('Create duplicate ledger', function(next) {
      this.test.req = {method: 'post', url: '/ledger', payload: ledger, expect: {status: 400}};
    });
  });

  //tr.each(ledgers).exec(
  //  function(next, ledger, index) {
  //    T.it2('Ledger for : ' + ledger.name, function(next) {
  //      this.test.req = {
  //        method: 'post',
  //        url: '/ledger',
  //        payload: ledger,
  //        callback: function(err, res) {
  //          T.setVar('lid' + index, res.body.response.insertId);
  //          next();
  //        }
  //      };
  //    });
  //    next();
  //  },
  //  function() {
  //    console.log('done');
  //  }
  //);

});