var T = require('./api_tester');
var db = require('../models/db');

describe("Ledger Group", function() {

  before(function(done) {
    db.getConnection(function(err, con) {
      con.query('DELETE FROM ledger_group WHERE id>40', function(err, result) {
        db.clean(con);
        done();
      });
    });
  });

  var index = 1, index2 = 1;

  for (var i = 0; i < 5; i++) {

    T.it2('Create Group', function(next) {
      this.test.req = {
        method: 'post',
        url: '/group',
        payload: {
          name: 'Test' + Date.now() + index,
          parentId: 11
        },
        callback: function(err, res) {
          T.setVar('gid' + index, res.body.response.insertId);
          index++;
          next();
        }
      };
    });

  }

  for (i = 0; i < 5; i++) {

    T.it2('Update Group', function(next) {
      this.test.req = {
        method: 'put',
        url: '/group/' + T.getVar('gid' + index2),
        payload: {
          name: 'Test-Updated' + Date.now() + index2
        },
        callback: function(err, res) {
          index2++;
          next();
        }
      };
    });
  }

  var request = [
    {name: '', parentId: 3},
    {parentId: -1},
    {name: 'sdfsdf~!@#$%^&*()'}
  ];

  request.forEach(function(payload) {
    T.it2('Create Group (Negative scenario)', function(next) {
      this.test.req = {
        method: 'post',
        url: '/group',
        payload: payload,
        expect: {status: 400}
      };
    });
  });

  T.it2('Update Group with invalid id (Negative scenario)', function(next) {
    this.test.req = {
      method: 'put',
      url: '/group/100',
      payload: {name: 'UpdateX', parentId: 155},
      expect: {status: 400}
    };
  });

  T.it2('Update Group with invalid parentId (Negative scenario)', function(next) {
    this.test.req = {
      method: 'put',
      url: '/group/' + T.getVar('gid1'),
      payload: {name: 'UpdateX', parentId: 155},
      expect: {status: 400}
    };
  });

  T.it2('Get one ledger group', function() {
    this.test.req = {url: '/group/' + T.getVar('gid1')};
  });

  T.it2('Get List of ledger group', function() {
    this.test.req = {
      url: '/group/list',
      payload: {page: 1, pageSize: 2}
    };
  });

  var index3 = 1;

  for (i = 0; i < 5; i++) {
    T.it2('Delete one ledger group', function(next) {
      this.test.req = {
        method: 'delete',
        url: '/group/' + T.getVar('gid' + index3),
        callback: function(err, res) {
          index3++;
          next();
        }
      };
    });
  }

});
