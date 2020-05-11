var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return Promise.resolve(a,b);
}).then(function(a,b) {
  console.log(a,b); // 3
  return 100;
}).then(function(val) {
  console.log(val); // 3
  return 101;
}).catch(function(err){
  console.log('error');
  return err;
}).then(function(err,val) {
  console.log('DONE', err, val);
});