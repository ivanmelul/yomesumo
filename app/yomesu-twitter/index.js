var express       = require('express'),
	bodyParser = require('body-parser'),
	Twitter = require('twitter'), //usamos este para el streaming y consultas a la api
	TwitterLogin = require('node-twitter-api'), //usamos este para el login de Twitter
	config        		= require('./config.js');

//incializo Twitter para streaming y para traer tweets
var twitter = new Twitter({
	consumer_key: config.twitter.consumerKey,
	consumer_secret: config.twitter.consumerSecret,
	access_token_key: config.twitter.accessToken,
	access_token_secret: config.twitter.accessTokenSecret
});

//inicializo Twitter login
var twitterLogin = new TwitterLogin({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callback: config.twitter.callback
});

var twitterTwittea = new TwitterLogin({
    consumerKey: config.twitter.consumerKeyParaTwittear,
    consumerSecret: config.twitter.consumerSecretParaTwittear
});

var app = express();

app.use('/', bodyParser.json({limit:'1mb'}));

// agregar mildware para leer body de los request
//app.use(bodyParser.json())

// registro de movimientos
app.use(function (req, res, next) {
  console.log('Time:', Date.now(), 'FROM: ' + req.ip,'TO: ' + req.protocol + '://' + req.get('host') + req.originalUrl + ' METHOD: ' + req.method);
  next();
});


// configuracion de ruteo (Recursos de la API rest)
require('./api.js')(app, twitter, twitterLogin, twitterTwittea);

// obtencion de tuits
require('./twitter-stream.js')(app, twitter);

// server start
app.listen(config.environment.port, function () {
  	console.log('Example app listening on port '+ config.environment.port + '!');
});