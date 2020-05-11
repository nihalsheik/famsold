var config = {
  apiUrl: "http://localhost:3000/api/v1",
  db: {
    host: "127.0.0.1",
    user: "root",
    password: "welcome01",
    database: "ac",
    connectionLimit: 25,
    multipleStatements: true
  },
  report: {
    pageLimit: 25
  }
};

exports.get = function(key) {
  return config[key];
};

//--------------------------------------------------------------------------------------//

function _parse(pkey, obj, json) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    var t = obj[key];
    var k = (pkey == '') ? key : pkey + '.' + key;
    if (typeof t === 'object' && !Array.isArray(t)) {
      _parse(k, t, json);
    } else {
      json[k] = t;
    }
  }
  return json;
}

config = _parse('', config, {});

//--------------------------------------------------------------------------------------//

