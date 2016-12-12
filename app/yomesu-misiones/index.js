// inicio de configuracion del server
var express = require('express'),
	config = require('./config'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

var app = express();

app.use('/', bodyParser.json({limit:'1mb'}));
// agregar mildware para leer body de los request
app.use(bodyParser.json())

// registro de movimientos
app.use(function (req, res, next) {
  console.log('Time:', Date.now(), 'FROM: ' + req.ip,'TO: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' METHOD: ' + req.method);
  next();
});

require('./yomesuConn.js')(mongoose, config.connection);

//defino schema
var schema = mongoose.Schema({
	name: String,
	description: String,
	active: Number,
	ong: String, // id de la ong
	startDate: Date,
	endDate: Date,
	image: String,
	hashTags: [String],
	voluntaries: [{
		_id: mongoose.Schema.Types.ObjectId,
		date: Date
	}],
	stages:[
		{
			name: String,
			description: String,
			active: Number,
			state: Number, //enum de estados, pendiente, en proceso, finalizado, cancelado
			startDate: Date,
			endDate: Date,
			image: String,
			markers:[{
				title: String,
				position:{
					type: {type: String},
					coordinates: [Number]
					//lat: Number,
					//lng: Number
				}
			}],
			requiredThings:[{
				description: String,
				urgency: Number,
				category: String,
				type: {type: String},
				name: String
			}],
			voluntaries: [{
				_id: mongoose.Schema.Types.ObjectId,
				username: String,
				date: Date
			}],
			hashTags: [String]
		}
	],
	media: [{
		username: String,
		text: String,
		social: String,
		date: Date
	}]
});

schema.index({ "stages.markers.position": "2dsphere" });

var Misiones = mongoose.model('Misiones', schema);

// configuracion de ruteo (Recursos de la API rest)
require('./api.js')(app, Misiones);

// server start
app.listen(config.environment.port, function () {
  	console.log('Example app listening on port '+ config.environment.port + '!');
});
