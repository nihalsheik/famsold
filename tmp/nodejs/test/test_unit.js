var T = require('./api_tester');
var db = require('../models/db');

var dataSet = {
  label: 'Create new Unit',
  request: {
    method: 'post',
    payload: [
      {name: 'Kg1', description: 'Kilo Grams', decimalPlaces: 2},
      {name: 'Kg2', description: 'Kilo Grams', decimalPlaces: 2},
      {name: 'Kg3', description: 'Kilo Grams', decimalPlaces: 2},
      {name: 'Kg4', description: 'Kilo Grams', decimalPlaces: 2},
      {name: 'Kg5', description: 'Kilo Grams', decimalPlaces: 2}
    ],
    expectStatus: 200
  }
};

describe("Unit Test", function() {

  before(function(done) {
    db.getConnection(function(err, con) {
      con.query('DELETE FROM unit;ALTER TABLE unit AUTO_INCREMENT = 1;', function(err, result) {
        db.clean(con);
        done();
      });
    });
  });

  var index = 1;
  var request = dataSet.request;

  request.payload.forEach(function(payload) {

    T.it2('Create Unit', function(next) {
      this.test.req = {
        method: 'post',
        url: '/unit',
        payload: payload,
        callback: function(err, res) {
          T.setVar('uid' + index++, res.body.response.insertId);
          next();
        }
      };
    });

  });


  var index2 = 1;
  request.payload.forEach(function(payload) {
    T.it2('Update Unit', function() {
      this.test.req = {
        method: 'put',
        url: '/unit/' + T.getVar('uid' + index2++),
        payload: {
          name: payload.name + '-updated'
        }
      };
    });
  });

  T.it2('Create Unit with Duplicate name', function(next) {
    this.test.req = {
      method: 'post',
      url: '/unit',
      payload: {name: 'Kg1-updated'},
      expect: {status: 400}
    };
  });

  T.it2('Update Unit with Duplicate name', function(next) {
    this.test.req = {
      method: 'put',
      url: '/unit/' + T.getVar('uid1'),
      payload: {name: 'Kg2-updated'},
      expect: {status: 400}
    };
  });

  request = [
    {name: '', description: 'Kilo Grams', decimalPlaces: -1},
    {description: 'Kilo Grams', decimalPlaces: 2},
    {name: 'sdfsdf~!@#$%^&*()', description: 'Kilo Grams', decimalPlaces: 2}
  ];

  request.forEach(function(payload) {

    T.it2('Create Unit (Negative Scenerio)', function(next) {
      this.test.req = {
        method: 'post',
        url: '/unit',
        payload: payload,
        expect: {status: 400}
      };
    });
  });

  T.it2('Get one Unit', function() {
    this.test.req = {url: '/unit/' + T.getVar('uid1')};
  });

  T.it2('Get List of Units', function() {
    this.test.req = {
      url: '/unit/list',
      payload: {page: 1, pageSize: 2}
    };
  });

  T.it2('Delete one Unit', function() {
    this.test.req = {
      method: 'delete',
      url: '/unit/' + T.getVar('uid1')
    };
  });
});
