/**
 * @author Sheik/Metron
 * @param arr
 * @param type
 * @constructor
 */
function TaskRunner(arr, type) {

  var _noOfTimes = 0;

  if (type == 4) {
    _noOfTimes = arr;
  }

  arr = Array.isArray(arr) ? arr : [];
  var ctx
    , length
    , errHandler = null
    , index = 0
    , _limit = 0;

  this.context = function(context) {
    ctx = context;
    return this;
  };

  this.then = function(fn, flag) {
    if (flag == null || flag == true) {
      arr.push(fn);
    }
    return this;
  };

  this.onError = function(handler) {
    errHandler = handler;
    return this;
  };

  this.limit = function(limit) {
    _limit = limit;
    return this;
  };

  this.exec = function(cb1, cb2) {
    length = arr.length;
    if (type == 1) {
      _series(cb1);
    } else if (type == 2) {
      _parallel(cb1);
    } else if (type == 3) {
      _each(cb1, cb2);
    } else if (type == 4) {
      length = _noOfTimes;
      _times(cb1, cb2);
    }
  };

  function _series(done) {
    if (length == 0) return done();
    (function next() {
      if (index >= length) return;
      var cb = {
        skip: function(skip) {
          index += skip;
          return this;
        }
      };
      if (done instanceof Function) {
        cb.done = done.bind(ctx);
      }
      if (errHandler instanceof Function) {
        cb.error = errHandler.bind(ctx);
      }
      if (index < length - 1) cb.next = next; else cb.next = cb.done;
      var args = [cb];
      var fn = arr[index++];
      if (!(fn instanceof Function)) {
        args = args.concat(fn.args);
        fn = fn.fn;
      }
      args = args.concat(Array.prototype.slice.call(arguments));
      fn.apply(ctx, args);
    })();
  }

  function _parallel(done) {
    if (length == 0) return done();
    arr.forEach(function(fn) {
      fn.call(ctx, function() {
        if (index++ >= length - 1) done.call(ctx, arguments);
      });
    });
  }

  function _each(callback, done) {
    if (length == 0) return done();

    index = -1;
    (function next() {
      if (++index >= length) return done.call(ctx);
      if (_limit > 0 && index % _limit == 0) {
        setTimeout(function() {
          callback.apply(ctx, [next, arr[index], index]);
        }, 0);
      } else {
        callback.apply(ctx, [next, arr[index], index]);
      }
    })();
  }

  function _times(callback, done) {
    if (length == 0) return done();
    index = -1;
    (function next() {
      if (++index >= length) return done.call(ctx);
      if (_limit > 0 && index % _limit == 0) {
        setTimeout(function() {
          callback.apply(ctx, [next, index]);
        }, 0);
      } else {
        callback.apply(ctx, [next, index]);
      }
    })();
  }

}

exports.series = function(arr) {
  return new TaskRunner(arr, 1);
};

exports.parallel = function(arr) {
  return new TaskRunner(arr, 2);
};

exports.each = function(arr) {
  return new TaskRunner(arr, 3);
};

exports.times = function(noOfTimes) {
  return new TaskRunner(noOfTimes, 4);
};

/*
exports
  .series()
  .context(this)
  .then(function one(cb) {
    console.log('one');
    cb.next();
    cb.next();
  })
  .then(function one(cb) {
    console.log('two');
    cb.next(1);
  })
  .then(function one(cb) {
    console.log('three');
    cb.next();
  })
  .exec(function() {
    console.log('done');
  });




 */