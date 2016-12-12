var express = require('express'),
	fs 		= require("fs"),
	config 	= require('./config');


module.exports = function(app){

	var router = express.Router();




////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


	router.get('/header', function (req, res) {
		var img = fs.readFileSync( __dirname + '/src/header.png');
		res.writeHead(200, {'Content-Type': 'image/png' });
		res.end(img, 'binary');
	});

	router.get('/fb', function (req, res) {
		var img = fs.readFileSync( __dirname + '/src/facebook.png');
		res.writeHead(200, {'Content-Type': 'image/png' });
		res.end(img, 'binary');
	});

	router.get('/tw', function (req, res) {
		var img = fs.readFileSync( __dirname + '/src/twitter.png');
		res.writeHead(200, {'Content-Type': 'image/png' });
		res.end(img, 'binary');
	});

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



	router.use('/', express.static(__dirname + config.imageFolder));


	app.use('/' + config.name, router);
};

