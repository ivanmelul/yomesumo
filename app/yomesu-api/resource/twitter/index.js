var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	twitterMethods = require('./methods'),
	request = require('../../utils/request')();

module.exports = function(app){
	var _requestToken, _requestTokenSecret;
	var router = express.Router();
	
	router.use(bodyParser.json());

	//nueva keyword
	router.get('/keyword', function(req, res){
		twitterMethods.postKeyword(req.body).then(function(resp){
			res.send(resp);
		}, function(err){
			res.status(err.status).send(err.message);
		});
	});

	router.get('/login', function(req, res){
		twitterMethods.getAccessToken().then(function(resp){

			//redirecciono al login de twitter
			res.send({ redirect: resp.redirectUrl, requestToken: resp.requestToken, requestTokenSecret: resp.requestTokenSecret });
		}, function(err){
			res.status(err.status).send(err.message);
		});
	});

	router.post('/login', function(req, res){
		//logeo al usuario y devuelvo un ticket
		twitterMethods.login(req.body).then(function(resp){
			res.send(resp);
		}, function(err){
			res.status(401).send(err);
		});

	});

	router.get('/callback', function(req, res){
		
		//si no acepta, lo mando a la pantalla de login del FE de vuelta y muestro mensaje
		if (req.query.denied) {
			res.redirect(config.loginScreenFE);
		}
		else
		{
			var oauth_token = req.query.oauth_token;
			var oauth_verifier = req.query.oauth_verifier;
			
			//tengo que hacer esto porque twitter pone los parametros antes del #, y se complica leerlos
			res.redirect(config.twitterFECallback + '?oauth_token=' + oauth_token + '&oauth_verifier=' + oauth_verifier);
		}
	});

	app.use('/' + config.name, router);
};