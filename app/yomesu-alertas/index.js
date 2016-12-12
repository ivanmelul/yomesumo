var mongo = require('mongodb'),
	config = require('./config'),
	express = require('express'),
	daemon = require('./daemon')();


var app = express();

// configuracion de ruteo (Recursos de la API rest)
require('./api.js')(app, daemon);

// server start
app.listen(config.environment.port, function () {
  	console.log('Alertas app listening on port '+ config.environment.port + '!');
});

// inicio el demonio
daemon.init();