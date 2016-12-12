// inicio de configuracion del server
var express = require('express'),
	config = require('./config'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

var app = express();

// parse application/json
app.use(bodyParser.json());

// registro de movimientos
app.use(function (req, res, next) {
  console.log('Time:', Date.now(), 'FROM: ' + req.ip,'TO: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' METHOD: ' + req.method);
  next();
});

require('./yomesuConn.js')(mongoose, config.connection);

//defino schema
var Voluntario = mongoose.model('Voluntario', mongoose.Schema({
	username: String,
	name: String,
	lastname: String,
	password: String,
	mail: String,
	lastLogin: String,
	image: String,
	state: Number, // se refiere al estado del usuario, activo, bloqueado
	fb: {
		id: String,
		token: String,
		username: String,
		commentIdOrigin: String
	},
	twitter: {
		id: String,
		token: String,
		tokenSecret: String,
		name: String,
		username: String
	},
	ngos:[
		{
			id: Number, // id de la ong
			role: String
		}
	],
	missions:[
		{
			id: Number, // id de la mision
			role: String
		}
	],
	privacity:{
		showMail: Boolean,
		showFacebook: Boolean,
		showTwitter: Boolean
	},
	alerts:[
		{
			mission: Number,
			action: Number, // hacer un enum de acciones observables (ejemplo, etapa completada, fin de la mision, etc)
			sendMail: Boolean,
			sendFacebook: Boolean,
			sendTwitter: Boolean
		}
	],
	notifications:{
		ngos: [{
			_id: mongoose.Schema.Types.ObjectId
		}],
		donations: [{
			description: String,
			category: String,
			type: {type: String},
			name: String
		}],
		activities:[{
			description: String,
			category: String,
			type: {type: String},
			name: String
		}]/*,
		regions:[{
			_id: mongoose.Schema.Types.ObjectId
		}]*/
	}
}));

app.use(function nicknameValidation(req, res, next){
	var valid;
	if (~['POST','PUT'].indexOf(req.method)) {
		//TODO: implementar esto si es necesario
		//res.json({error: 'nickname duplicado2'})
		valid = true;
		next();
	} else {
		valid = true;
		next();
	}
});

// configuracion de ruteo (Recursos de la API rest)
require('./api.js')(app, Voluntario);

// server start
app.listen(config.environment.port, function () {
  	console.log('Example app listening on port '+ config.environment.port + '!');
});
