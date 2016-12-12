var express = require('express'),
	config = require('./config'),
	bodyParser = require('body-parser');

var app = express();

// agregar mildware para leer body de los request
app.use(bodyParser.json())

// registro de movimientos
app.use(function (req, res, next) {
  console.log('Time:', Date.now(), 'FROM: ' + req.ip,'TO: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' METHOD: ' + req.method);
  next();
});


// configuracion de operaciones
require('./api.js')(app);
// server start
app.listen(config.environment.port, function () {
  	console.log('Example app listening on port '+ config.environment.port + '!');
});
