var T = require('./api_tester');
var db = require('../models/db');

describe("Voucher Type", function() {

  before(function(done) {
    db.getConnection(function(err, con) {
      con.query('DELETE FROM voucher_type WHERE id>100', function(err, result) {
        db.clean(con);
        done();
      });
    });
  });

  var index = 1;
  var request = [
    {name: 'Test1', shortName: 'T1'},
    {name: 'Test2', shortName: 'T2'},
    {name: 'Test3', shortName: 'T3'}
  ];

  request.forEach(function(payload) {
    T.it2('Create Voucher Type', function(next) {
      this.test.req = {
        method: 'post',
        url: '/voucher_type',
        payload: payload,
        callback: function(err, res) {
          T.setVar('vtid' + index++, res.body.response.insertId);
          next();
        }
      };
    });

  });

  T.it2('Update Unit', function() {
    this.test.req = {
      method: 'put',
      url: '/voucher_type/' + T.getVar('vtid1'),
      payload: {
        name: 'Test1-Updated'
      }
    };
  });

  T.it2('Get one Unit', function() {
    this.test.req = {url: '/voucher_type/' + T.getVar('vtid1')};
  });

  T.it2('Get List of Units', function() {
    this.test.req = {
      url: '/voucher_type/list',
      payload: {page: 1, pageSize: 2}
    };
  });

  T.it2('Delete one Unit', function() {
    this.test.req = {
      method: 'delete',
      url: '/voucher_type/' + T.getVar('vtid1')
    };
  });
});
