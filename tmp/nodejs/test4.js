var util = require("util");

function A(config) {

  this._var = {
    query: 'query',
    config: config
  };

  this.name = 'old';
  this.getTable = function() {
    return 'A table';
  };
}

A.prototype.log =  function(){
  console.log('my old name is: '+ this.name);
  console.log(JSON.stringify(this._var, null, 2));
  console.log(this.getTable());
};

function B(config){
  A.call(this,config);

  this.name = 'new';
  this.getTable = function() {
    return 'B table';
  }
}

util.inherits(B, A);

B.prototype.log = function(){
  B.super_.prototype.log.apply(this);
  console.log('my new name is: ' + this.name);
  console.log(this.getTable());
};


var b = new B(100);
b.log();