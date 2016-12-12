var express = require('express'),
	searchEngine = require('./search-engine.js'),
	config  = require('./config');

module.exports = function(app, twitter, twitterLogin, twitterTwittea){
	var _accessTokenYMS, _accessTokenSecretYMS;
	var router = express.Router();

	router.post('/keyword', function(req, res){
		var body = req.body || {};

		if (body.list && body.list.length > 0){
			for (var i = 0; i < body.list.length; i++) {
				searchEngine.add(body.list[i]);
			}
		}

		res.send();
	});

	router.delete('/keyword', function(req, res){
		var body = req.body || {};

		if (body.list && body.list.length > 0){
			for (keyword in body.list){
				searchEngine.remove(keyword);
			}
		}

		res.send();
	});

	router.get('/keyword', function(req, res){
		res.send(searchEngine.getAll());
	});

	router.get('/access_token', function(req, res){
		//genero la url a la cual debo redireccionar al usuario para que se loguee con Twitter
		twitterLogin.getRequestToken(function(error, requestToken, requestTokenSecret, results){
			if (error) {
				res.status(500).send('Error generando el access token');
			} else {
				
				var twObject = {
					requestToken: requestToken,
					requestTokenSecret: requestTokenSecret,
					redirectUrl: twitterLogin.getAuthUrl(requestToken)
				};

				//devuelvo objeto con dato de conexion
				res.send(twObject);
			}
		});
	});

	//trae el usuario de twitter en base al token y al verifier
	router.get('/user', function(req, res){
		var oauthToken = req.query.at;
		var oauthVerifier = req.query.av;
		var requestToken = req.query.rt;
		var requestTokenSecret = req.query.rts;

		twitterLogin.getAccessToken(requestToken, requestTokenSecret, oauthVerifier, function(error, accessToken, accessTokenSecret, results) {
		    if (error) return handleError(error);

	    	var params = {
	    		include_entities: true,
	    		skip_status: true,
	    		include_email: true
	    	};

	    	twitterLogin.verifyCredentials(accessToken, accessTokenSecret, params, function(error, data, response) {
			    if (error) return handleError(error);

		    	// if (data.screen_name == 'yomesumored'){
		    	// 	debugger;
		    	// 	_accessTokenYMS = accessToken;
		    	// 	_accessTokenSecretYMS = accessTokenSecret;

		    	// 	res.status(401).send('Todo OK');
		    	// } else {

					//genero un usuario de yomesumo
					var user = {
						name: data.name,
						username: data.screen_name,
						mail: data.email,
						image: searchEngine.getOriginalImageUrl(data.profile_image_url), 
						twitter: {
							id: data.id,
							token: accessToken,
							tokenSecret: accessTokenSecret,
							name: data.name,
							username: data.screen_name
						}
					};

					res.send(user);
				//}

				
			});

		});
	});

	router.post('/status', function(req, res) {
		var msg = getMessage(req.body.type, req.body.data);

		var statusObj = {status: msg};
		debugger;
        twitterTwittea.statuses(
        	"update",
        	statusObj,
		    config.twitter.ymsAccessToken,
		    config.twitter.ymsAccessTokenSecret,
		    function(error, data, response) {
		    	if(error){
					console.log(error);
	      			res.sendStatus(400).send(error);
				}

				console.log(statusObj,data.text);
	      		res.send(data.text);
		        
		    }
		);
	});

	function handleError(err){
		throw err;
	}
	function getMessage(type, data){
		var resp;
		switch(type){
			case 'newVoluntary':
				resp = "Te damos la bienvenida a nuestra comunidad @" + data.username;
			break;
			case 'addToMision':
				resp = "@" + data.username + ": " + data.postText;
			break;
		}
		return resp;
	}

	app.use('/', router);
};
