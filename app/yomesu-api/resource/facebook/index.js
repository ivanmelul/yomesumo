var express = require('express'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	request = require('../../utils/request')(),
	fbMethods = require('./methods'),
	ongMethods = require('../ong/methods');


var fb = {};

module.exports = function(app){
	var router = express.Router();
	
	router.use(bodyParser.json());

	router.get('/login', function (req, res, next) {
		fbMethods.get('/login').then(function(resp){
			res.send(resp);
		});
	});

	router.post('/login', function (req, res, next) {
		fbMethods.login(req.body).then(function(resp){
			fb = resp.fb;
			res.send(resp);
		}, function(err){
			res.status(401).send(err);
		});
	});

	router.get('/listenHashtags/:ongId', function (req, res, next) {
		req.body.fb = fb;

		ongMethods.get('/?_id=' + req.params.ongId).then(function getOngResponse(ongs){
			var ong = ongs[0];
			fbMethods.post('/listenHashtags/'+ ong.fbUrl, req.body).then(function(resp){
				res.send(resp);
			}, function(err){
				res.status(401).send(err);
			});

		});

	});

	app.use('/' + config.name, router);
};