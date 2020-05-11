var T = require('./api_tester');
var db = require('../models/db');

var dataSet = {
  label: 'Create new Inventory Item',
  request: {
    method: 'post',
    payload: [
      {name: 'Lux Soap1', unitId: 2, description: 'desc'},
      {name: 'Lux Soap2', unitId: 3, description: 'desc'},
      {name: 'Lux Soap3', unitId: 4, description: 'desc'},
      {name: 'Lux Soap4', unitId: 4, description: 'desc'},
      {name: 'Lux Soap5', unitId: 2, description: 'desc'}
    ],
    expectStatus: 200
  }
};

describe("Inventory", function() {

  before(function(done) {
    db.getConnection(function(err, con) {
      con.query('DELETE FROM inventory_item;ALTER TABLE inventory_item AUTO_INCREMENT = 1;', function(err, result) {
        db.clean(con);
        done();
      });
    });
  });

  var index = 1;
  var request = dataSet.request;

  request.payload.forEach(function(payload) {
    T.it2('Create inventory', function(next) {
      this.test.req = {
        method: 'post',
        url: '/inventory',
        payload: payload,
        callback: function(err, res) {
          T.setVar('iid' + index++, res.body.response.insertId);
          next();
        }
      };
    });
  });

  var index2 = 1;
  request.payload.forEach(function(payload) {
    T.it2('Update inventory', function() {
      this.test.req = {
        method: 'put',
        url: '/inventory/' + T.getVar('iid' + index2++),
        payload: {
          name: payload.name + '-updated'
        }
      };
    });
  });

  T.it2('Get one inventory', function() {
    this.test.req = {url: '/inventory/' + T.getVar('iid1')};
  });

  T.it2('Get List of inventory', function() {
    this.test.req = {
      url: '/inventory/list',
      payload: {page: 1, pageSize: 2}
    };
  });

  T.it2('Delete one inventory', function() {
    this.test.req = {
      method: 'delete',
      url: '/inventory/' + T.getVar('iid1')
    };
  });

});
