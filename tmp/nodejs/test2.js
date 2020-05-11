var tr = require('./helpers/task_runner');

tr.series()
  .then({fn: _checkExistence1, args: [1, 2]})
  .then({fn: _checkExistence2, args: [1, 2]})
  .exec(function() {
    console.log('done');
  });

function _checkExistence1(cb, a, b) {
  console.log(a,b);
  cb.next(3);
}

function _checkExistence2(cb, a, b,c) {
  console.log(a,b,c);
  cb.next();
}