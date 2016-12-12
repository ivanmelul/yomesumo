var express = require('express'),
	config = require('./config'),
	bodyParser = require('body-parser'),
	loginMethods = require('./methods');


module.exports = function(app){

	var router = express.Router();
		
	router.use(bodyParser.json());

	// login
	router.post('/', function (req, res, next) {		
		loginMethods.login(req.body).then(function(resp){
			res.send(resp);
		}, function(err){
			//errores 4XX
			res.status(401).send(err);
		}).catch(function(err){
			//errores 5XX
			res.status(500).send(err);
			new Error(err);
		});
	});

	router.get('/logout', function (req, res, next) {		
		var tkc = req.query.token;
		loginMethods.logout(tkc);
		res.send('OK');
	});

	app.use('/' + config.name, router);
};