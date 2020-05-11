/**
 * Predefine some ObjectIDs
 */


String.prototype.toCamelCase = function() {
  var str = this.toLowerCase();
  return str.replace(/(_[a-zA-Z])/g, function($1) {
    return $1.toUpperCase().replace('_', '');
  });
};

String.prototype.toUnderscore = function() {
  return this.replace(/([A-Z])/g, function($1) {
    return "_" + $1.toLowerCase();
  });
};

exports.extend = function extend(dest, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key];
    }
  }
  return dest;
};

exports.copyObject = function copyObject(dest, src, checkDest) {

  checkDest = checkDest || false;

  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      if (typeof src[key] === "object" && src[key] !== null && dest[key]) {
        exports.copyObject(dest[key], src[key]);
      } else {
        if (checkDest == false || (checkDest == true && (dest[key] != 'undefined' || dest.hasOwnProperty(key)))) {
          dest[key] = src[key];
        }
      }
    }
  }
  return dest;
};

/**
 * Added by Sheik
 */
exports.merge = function merge() {

  var obj = {}, olen = arguments.length, key;

  for (var i = 0; i < olen; i++) {
    var tobj = arguments[i];
    for (key in tobj) {
      if (tobj.hasOwnProperty(key)) {
        obj[key] = tobj[key];
      }
    }
  }
  return obj;
};

exports.clone = function clone(src) {
  var dest = {};
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      if (typeof src[key] === "object") {
        dest[key] = exports.clone(src[key]);
      } else {
        dest[key] = src[key];
      }
    }
  }
  return dest;
};

/**
 * Implemented by Sheik
 * @param obj
 * @returns {boolean}
 */
exports.isEmpty = function isEmpty(obj) {

  if (obj == null || obj === 'undefined' || obj == '') {
    return true;

  } else if (typeof obj === 'boolean' || typeof obj === 'number') {
    return false;

  } else if (typeof obj === 'object') {
    return Object.keys(obj).length == 0;

  } else if (Array.isArray(obj)) {
    return obj.length == 0;

  } else if (typeof  obj === 'string') {
    return ('' + obj).trim() == '';

  }

  return false;

};

exports.isObjectId = function isObjectId(objId) {
  return objId.match('^[0-9a-fA-F]{24}$')
};

exports.round = function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

exports.parseObject = function(req) {
  var dataSet, hasArray;

  if (Array.isArray(req.data)) {
    hasArray = true;
    dataSet = req.data;
  } else {
    hasArray = false;
    dataSet = [req.data];
  }

  var fieldMap = req.fieldMap || [];
  var filter = req.filter || null;
  var self = this;

  var resArray = [];
  dataSet.forEach(function(data) {
    data = data || {};
    var res = {};
    fieldMap.forEach(function(field) {

      var names = Array.isArray(field.name) ? field.name : [field.name];
      var def = field.hasOwnProperty('def') ? field.def : null;

      names.forEach(function(name) {
        var t = name.split(':'), fn1, fn2;
        if (t.length == 2) {
          fn1 = t[0];
          fn2 = t[1];
        } else {
          fn1 = name;
          fn2 = name;
        }
        var fv = data[fn2];
        if (filter instanceof Function) {
          fv = filter(res, field, fn2, fn1, fv);
        }
        if (!self.isEmpty(fv)) {
          res[fn1] = fv;
        } else if (def != null) {
          res[fn1] = def;
        }

      });
    });
    resArray.push(res);
  });

  return hasArray ? resArray : resArray[0];

};

exports.compareObj = function(src, dest, level) {

  var res = true;
  var self = this;
  var key = '';

  if (!Array.isArray(src) && !Array.isArray(dest) && level != null) {
    if (typeof src == 'object' && typeof dest == 'object') {
      var ln = 0;
      for (key in src) {
        if (src.hasOwnProperty(key) && key.indexOf('$optional') != -1) {
          ln++;
        }
      }
      var slen = Object.keys(src).length;
      var dlen = Object.keys(dest).length;
      if (slen != dlen && (slen - ln) != dlen) {
        //logger.error("compareObj : Length doesn't match");
        return false;
      }
    }
  }

  for (key in src) {
    if (!src.hasOwnProperty(key) || key.indexOf('$optional') != -1) {
      continue;
    }

    var csv = '' + (src[key] || '');

    if (typeof src[key] == 'object') {

      if (key.toLowerCase().indexOf('$or') != -1 && Array.isArray(csv)) {
        var k = key.replace('$or.', '');
        csv.forEach(function(v, index) {
          var r = self.compareObj(v, dest[k] || {}, level + 1);
          res = (index == 0) ? r : res || r;
        });
      } else {
        res = self.compareObj(src[key], dest[key] || {}, level + 1);
      }

    } else {
      if (!self.isEmpty(src[key]) && !self.isEmpty(src[key]) && typeof src[key] != typeof dest[key]) {
        //logger.error("compareObj : Object type doesn't match");
        res = false;
      } else {
        if (!dest.hasOwnProperty(key)) {
          //logger.error("compareObj : Property doesn't match");
          res = false;
        }
      }

      if (res == false) {
        break;
      }
    }
  }
  return res;
};

exports.makeObjectArray = function(array, id) {
  var t = {};
  array.forEach(function(data) {
    t[data[id]] = data;
  });
  return t;
};

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

exports.queryArray = function(array, key, callback) {

  var arr = {}, cb;
  key = key || 'id';

  if (callback instanceof Function) {
    var id;
    cb = function(v) {
      id = v[key];
      arr[id] = v;
      callback(v, id);
    }
  } else {
    cb = function d(v) {
      arr[v[key]] = v;
    }
  }

  array.forEach(cb);

  this.has = function(key) {
    return arr.hasOwnProperty(key);
  };

  this.get = function(key) {
    return arr[key];
  };

  this.getAll = function() {
    return arr;
  };

  return this;
};

//exports.toBoolean = function(value) {
//  return (/^(true|1)$/i).test(('' + value).toString());
//};

//var t = exports.queryArray([{id: 1, name: 'a'}, {id: 2, name: 'b'}], 'id');
//console.log(t.get(1));
//console.log(t.get(2));
//console.log(t.get(4));