var express = require('express'),
	config = require('./config'),
	globalConfig = require('../../config'),
	bodyParser = require('body-parser'),
	ongMethods = require('./methods'),
	misionMethods = require('../mision/methods'),
	imagesMethods = require('../images/methods'),
	tickets = require('../../utils/tickets'),
	Q = require('q'),
	request = require('../../utils/request')();

module.exports = function(app){
	var router = express.Router();

	router.use('/', bodyParser.json({limit:'1mb'}));

	router.get('/', function (req, res, next) {
		ongMethods.get(req.url).then(function getOngResponse(ongs){
			var arrPromises = [];
			// por cada ong, voy a buscar las misiones asociadas
			for (var i = 0; i < ongs.length; i++) {
				arrPromises.push(misionMethods.get('/?ong=' + ongs[i]._id));
			}
			Q.all(arrPromises).then(function allMisionPromiseResolve(responses){
				// el largo de responses y ongs ES el mismo (si no, hay algo mal)
				for (var i = 0; i < ongs.length; i++) {
					ongs[i].missions = responses[i];
				}
				res.send(ongs);
			});
		});
	});

	router.use('/', function(req, res, next) {
		// valido que el usuario tenga permisos para acceder a esa ong
		if (!~['OPTIONS'].indexOf(req.method)) {
			var tkc = req.headers['x-session-token'];
			if (tickets.isValidTicket(tkc)) {
				var user = tickets.getUser(tkc);
				var hasAccess = false;
				var ongId = req.body && req.body._id || req.query._id;
				for (var i = 0; i < user.ngos.length; i++) {
					if(user.ngos[i]._id === ongId) {
						hasAccess = true;
						break;
					}
				};
				if(hasAccess) {
					// paso la validación, el usuario tiene permisos
					next();
				} else {
					// el usuario no tiene permiso para esa ONG
					res.status(401).send("No esta autorizado para modificar esa ONG");
				}
			} else {
				// vencio el ticket
				res.status(401).send("Session expirada, vuelva a loguearse");
			}
			
		} else {
			// si es OPTION no hago nada
			next();
		}
		
	});

	router.put('/', function (req, res, next) {
		if (req.body && req.body.image && req.body.image.length > 10000) {
			// sobre escribo la imagen base64 por la url de la imagen
			var imagePath = imagesMethods.generate(req.body.image);
			req.body.image = req.protocol + '://' + req.host + ':' + globalConfig.environment.port + imagePath
		}
		req.body.image = req.protocol + '://' + req.host + ':' + globalConfig.environment.port + imagePath
		ongMethods.update(req.body).then(function (resp) {
			res.send(resp);
		}, function (err) {
			res.status(500).send(err);
		});
	});



	app.use('/' + config.name, router);
};