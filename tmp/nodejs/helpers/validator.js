/**
 * Created by sheik on 23-09-2015.
 */

'use strict';

var util = require('../helpers/util');
var ApiError = require('./api_error');
var tr = require('./task_runner');

var name = /^[A-Z][ A-Z0-9_\-\/'&]+$/i;
/**
 * Regular Expressions
 */
var Rules = {
  NAME: name,
  ALPHA: /^[A-Z]+$/i,
  ALPHA_NUMERIC: /^[0-9A-Z]+$/i,
  NUMERIC: /^[-+]?[0-9]+$/,
  POSITIVE: /^[+]?[0-9]+$/,
  NEGATIVE: /^[-]?[0-9]+$/,
  INT: /^(?:[-+]?(?:0|[1-9][0-9]*))$/,
  FLOAT: /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
  HEXADECIMAL: /^[0-9A-F]+$/i,
  DECIMAL: /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/,
  HEXCOLOR: /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,
  PHONE: [
    /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/,
    /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
  ],
  EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  TIMESTAMP: /^\d{13}$/
};

exports.Rules = Rules;

var Types = {
  STRING: 'string',
  NUMERIC: 'numeric',
  DATE: 'date',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  EMAIL: 'email',
  JSON: 'json',
  OBJECT: 'object',
  TIMESTAMP: 'timestamp'
};

exports.Types = Types;

exports.validate = function(data) {

  var _fieldMap
    , onValidateHandler
    , option = {};

  this.fieldMap = function(fieldMap) {
    _fieldMap = fieldMap;
    return this;
  };

  this.onValidate = function(validateHandler) {
    onValidateHandler = validateHandler;
    return this;
  };

  this.option = function(opt) {
    option = opt;
    return this;
  };

  var newData = {};

  this.exec = function() {

    var fields = {};
    _fieldMap.forEach(function(fieldData) {

      var field = util.extend(
        {
          name: '',
          type: 'string',
          required: false,
          allowNull: true,
          allowedValues: '',
          defaultValue: null,
          error: '',
          rule: '',
          length: 0,
          min: null,
          max: null,
          message: '',
          isEmpty: false
        },
        fieldData
      );

      if (util.isEmpty(field.value)) {
        if (!util.isEmpty(data[field.name])) {
          field.value = data[field.name];
        } else if (field.defaultValue != null) {
          field.value = field.defaultValue;
        } else {
          field.value = '';
          field.isEmpty = true;
        }
      }

      if (onValidateHandler && onValidateHandler instanceof Function) {
        onValidateHandler.call(this, field, data);
      } else {
        this.validateField(field, data);
      }

      if (field.error != '') {
        fields[field.name] = {message: field.error, value: field.value};
      } else if (!field.isEmpty) {
        newData[field.name] = field.value;
      }

    }.bind(this));

    //-------------------------------------------------------//
    var err = null;
    if (Object.keys(fields).length > 0) {
      err = new ApiError(41000);
      err.fields = fields;
    }
    return {error: err, data: newData};
    //-------------------------------------------------------//

  };

  this.validateField = function(field, data) {

    field.error = '';

    if (field.isEmpty) {
      if (field.required == true || (data.hasOwnProperty(field.name) && field.allowNull == false)) {
        field.error = 'Required field[' + field.name + '] should not be empty';
        return field;
      } else {
        return field;
      }
    }

    if (field.length > 0 && field.value.length != field.length) {
      field.error = 'Invalid ' + field.name + '. Invalid length';
      return field;
    }

    var t;

    switch (field.type) {
      case Types.TIMESTAMP:
        if (!this.Rules.TIMESTAMP.test(field.value)) {
          field.error = 'Invalid ' + field.name + '. It should be timstamp';
        }
        break;
      case Types.DATE:
        t = this.toDate(field.value);
        //console.log(t);
        if (t == null) {
          field.error = 'Invalid Date : ' + field.name;
        } else {
          field.value = t;
        }
        break;

      case Types.OBJECT:
      case Types.JSON:
        try {
          t = JSON.parse(field.value);
          if (typeof t != 'object') throw new Error();
        } catch (err) {
          field.error = 'Invalid ' + field.name + '. It should be json object';
        }
        break;
      case Types.NUMERIC:
        if (this.Rules.NUMERIC.test(field.value)) {
          if (field.min != null && field.value < field.min) {
            field.error = 'Invalid ' + field.name + '. minimum value should be ' + field.min;
          }
          if (field.max != null && field.value > field.max) {
            field.error = 'Invalid ' + field.name + '. maximum value should be ' + field.max;
          }
          field.value = Number(field.value);
        } else {
          field.error = 'Invalid ' + field.name + '. It should be numeric';
        }
        break;

      case Types.BOOLEAN:
        if (!this.isBoolean(field.value)) {
          field.error = 'Invalid ' + field.name + '. It should be true/false';
        } else {
          field.value = this.toBoolean(field.value);
        }
        break;

      case Types.EMAIL:
        if (!this.isEmail(field.value)) {
          field.error = 'Invalid email';
        }
        break;

      case Types.ARRAY:
        if (!Array.isArray(field.value)) {
          field.error = 'Invalid ' + field.name + ', It should be array of value';
        } else if (Array.isArray(field.value) && field.value.length == 0) {
          field.error = 'Invalid ' + field.name + ", Array value shouldn't be empty";
        }
        break;

    }

    if (field.error == '' && field.rule != '') {
      var rules = Array.isArray(field.rule) ? field.rule : [field.rule];
      var values = Array.isArray(field.value) ? field.value : [field.value];
      var res = true;
      values.forEach(function(value) {
        var vres = false;
        rules.forEach(function(pattern) {
          vres = vres || pattern.test(value);
        });
        res = vres ? res : false;
      });
      if (res == false) {
        field.error = 'Invalid ' + field.name;
      }
    }

    return field;

  };

  return this;
};

exports.isNumeric = function(value) {
  return Rules.NUMERIC.test(value);
};

exports.isPositive = function(value, includeZero) {
  var res = Rules.POSITIVE.test(value);
  return (res && !includeZero) ? parseInt(value) > 0 : res;
};

exports.isNegative = function(value) {
  return Rules.NEGATIVE.test(value);
};

exports.isBoolean = function(value) {
  return new RegExp('^(true|false|0|1)$', 'i').test(value);
};

exports.isEmail = function(email) {
  return Rules.EMAIL.test(email);
};

exports.toBoolean = function(value) {
  return (/^(true|1)$/i).test(('' + value).toString());
};

exports.toDate = function(str) {
  if (str == "" || str == null) {
    return null;
  }
  // YYYY-MM-DD HH:MM:SS
  var m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})( (\d{2}))?(:([0-5][0-9]))?(:([0-5][0-9]))?$/);

  if (m === null || m.size < 7) {
    return null;
  }

  var year = parseInt(m[1])
    , month = parseInt(m[2])
    , day = parseInt(m[3])
    , hour = parseInt(m[5]) || 0
    , min = parseInt(m[7]) || 0;

  var ret = (year < 1999 || year > new Date().getFullYear()
  || month < 1 || month > 12
  || day < 1 || day > 31 || hour > 24
  || (!isNaN(hour) != null && min == null));

  if (ret) return null;

  var dt = new Date(Date.parse(m[0]));

  if (month == 2) {
    if (dt.getMonth() + 1 != month) {
      ret = null;
    }
  }

  return dt;

};
