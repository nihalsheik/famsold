var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/views'));

app.set('test-global-var', '123');

app.use('/api/v1', require('./routes/api'));
app.use(express.static(__dirname + '/test'));

var server = app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});
