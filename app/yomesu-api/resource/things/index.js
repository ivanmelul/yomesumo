var express = require('express'),
	thingsMethods = require('./methods'),
	bodyParser = require('body-parser'),
	config = require('./config');

module.exports = function(app){
	var router = express.Router();

	router.use('/', bodyParser.json());

	router.get('/', function (req, res, next) {
		thingsMethods.get(req.query).then(function(resp){
			res.send(resp);
		}, function(err) {
			res.status(400).send(err);
		}).catch(function(err) {
			res.status(500).send('ERROR: ' + err);
		});
	});

	app.use('/' + config.name, router);
};