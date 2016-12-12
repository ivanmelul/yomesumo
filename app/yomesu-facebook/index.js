var express       		= require('express'),
    config        		= require('./config'),
	bodyParser 			= require('body-parser'),
	daemon 				= require('./daemon')(),
	mongoose 			= require('mongoose')
	;

var app = express();

// parse application/json
app.use(bodyParser.json());

// registro de movimientos
app.use(function (req, res, next) {
	console.log('Time:', Date.now(), 'FROM: ' + req.ip,'TO: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
	next();
});



require('./yomesuConn.js')(mongoose, config.connection);

//defino schema
var ReadComments = mongoose.model('ReadComments', mongoose.Schema({
	commentId: String
}));


// configuracion de ruteo (Recursos de la API rest)
require('./api.js')(app, daemon);

// server start
app.listen(config.environment.port, function () {
  	console.log('Example app listening on port '+ config.environment.port + '!');
});



// inicio el demonio
daemon.init(ReadComments);