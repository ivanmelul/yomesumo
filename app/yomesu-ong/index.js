// inicio de configuracion del server
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// configuracion express
app.locals = {
	title: 'Yo me sumo ONGs',
	version: '1.0',
	port: 8005
};
// agregar mildware para leer body de los request
app.use(bodyParser.json({limit:'1mb'}));

// registro de movimientos
app.use(function (req, res, next) {
  console.log('Time: ' + Date.now() + ' FROM: ' + req.ip + ' TO: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' METHOD: ' + req.method);
  next();
});

// configuracion acesso base de datos
var connectionConfig = {
	host: 'localhost',
	port: 8009,
	dbName: 'yomesu',
	retry:1000 // ms
};

require('./yomesuConn.js')(mongoose, connectionConfig);

//defino schema
var Ong = mongoose.model('Ong', mongoose.Schema({
	name:String,
	fbUrl:String,
	description:String,
	address:String,
	telephone:String,
	contact: String,
	email: String,
	image: String
}));

// configuracion de operaciones
app.get('/', function (req, res) {
	req.query.name = new RegExp(req.query.name);

	Ong.find(req.query, function(err, result){
		res.send(result);
	});
});
app.put('/', function (req, res) {
	var id = req.body._id;
	delete req.body._id
	Ong.update({ _id: id }, { $set: req.body}, function(err, obj) {
		if (err) return handleError(err);
		if (obj.n === 1 && obj.ok === 1) {
			res.send('Operación realizada de forma correcta');
		} else {
			console.log('ERROR', obj);
			res.status(400).send('No se actualizo la ONG de forma correcta');
		}

	});
});
app.post('/', function (req, res) {
	var ong = new Ong(req.body);
	ong.save(function (err, obj) {
		if (err) return handleError(err);
		res.send(obj);
	});
});
app.delete('/', function (req, res) {
	if (req.body._id){
		Ong.find({ _id:req.body._id }).remove(function(err, obj){
			if (err) return handleError(err);
			res.send(obj);
		});
	}
});
// server start
app.listen(app.locals.port, function () {
  	console.log('NGO app listening on port '+ app.locals.port + '!');
});
