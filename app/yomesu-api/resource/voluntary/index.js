var express = require('express'),
	config = require('./config'),
	globalConfig = require('../../config'),
	bodyParser = require('body-parser'),
	voluntaryMethods = require('./methods'),
	imagesMethods = require('../images/methods'),
	fs = require("fs"),
	request = require('../../utils/request')();


module.exports = function(app){

	var router = express.Router();

	router.use('/', bodyParser.json({limit:'1mb'}));

	router.get('/', function (req, res, next) {
		voluntaryMethods.get(req.url).then(function(resp){
			res.send(resp);
		});
	});

	router.use('/', function(req, res, next) {
		// si el largo de la imagen es mayor a 10000 asumo que se trata de base64 y no un link
		if (req.body && req.body.image && req.body.image.length > 10000) {
			// sobre escribo la imagen base64 por la url de la imagen
			var imagePath = imagesMethods.generate(req.body.image);
			req.body.image = req.protocol + '://' + req.host + ':' + globalConfig.environment.port + imagePath
		}
		next();
	});

	//nuevo usuario
	router.post('/', function(req, res, next){
		voluntaryMethods.post(req.body).then(function(resp){
			console.log('ENVIANDO MAIL CREATE VOLUNTARY');

			request.post({
				host: config.mail.host,
				port: config.mail.port,
				path: '/',
				body: {
					"type": "registerUser",
					"data": {
						"voluntary": {
							"_id" : resp._id,
							"mail" : resp.mail
						}
					}
				}
			}).then(function(result){
				res.send(resp);
			}, function(err){
				res.status(err.status).send(err.message);
			});

		}, function(err){
			res.status(err.status).send(err.message);
		});
	});

	//modify usuario
	router.put('/', function(req, res, next){
		voluntaryMethods.update(req.body).then(function(resp){
			res.send(resp);

		}, function(err){
			res.status(err.status).send(err.message);
		});
	});

	// retorno el voluntario logueado. No hago consulta al micro servicio.
	router.get('/current', function (req, res, next) {
		var tkc = req.headers['x-session-token'];
		var user = voluntaryMethods.getCurrent(tkc);
		if (user) {
			res.send(user);
		} else {
			res.status(401).send('No estas logueado');
		}
	});

	app.use('/' + config.name, router);
};