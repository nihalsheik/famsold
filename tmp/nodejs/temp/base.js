(function() {

  function Base(table) {
    var data = {};

    this.table = table;

    this.data = function(key, val) {
      if (val) {
        data[key] = val;
      } else {
        return data[key];
      }
    };

    var t= 1;
  }

  Base.prototype.find = function(fields) {

  };

  var b = new Base();

})();


