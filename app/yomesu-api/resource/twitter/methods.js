var config = require('./config'),
	Q = require('q'),
	request = require('../../utils/request')(),
	voluntaryMethods = require('../voluntary/methods'),
	loginMethods = require('../login/methods');

module.exports = {
	postKeyword: function(keywords){
		var deferred = Q.defer();
		
		var properties = {
			host: config.host,
			port: config.port,
			path: '/keyword',
			body: keywords
		};
		
		request.post(properties).then(function postKeywordSuccess(strData){
			var data = JSON.parse(strData);
			deferred.resolve(data);
		}, function(err){
			deferred.reject(err);
		});	

		return deferred.promise;
	},

	getAccessToken: function(){
		var deferred = Q.defer();

		var properties = {
			host: config.host,
			port: config.port,
			path: '/access_token'
		};

		request.get(properties).then(function getAccessTokenSuccess(res){
			deferred.resolve(res);
		}, function(err){
			deferred.reject(err);
		});	

		return deferred.promise;
	},

	getUser: function(params){
		var deferred = Q.defer();

		var properties = {
			host: config.host,
			port: config.port,
			path: '/user?at=' + params.oauthToken + '&av=' + params.oauthVerifier + '&rt=' + params.requestToken + '&rts=' + params.requestTokenSecret
		};

		request.get(properties).then(function getUser(res){
			deferred.resolve(res);
		}, function(err){
			deferred.reject(err);
		});	

		return deferred.promise;
	},

	login: function(body){
		var deferred = Q.defer();

		var twMethods = this;

		//me traigo el user de twitter
		twMethods.getUser(body).then(function(user){

			//Primero intento logearlo con el twitterId
			loginMethods.login({ twId: user.twitter.id } ).then(function logInFromTw(resp){
				resp.twitter = user;
				deferred.resolve(resp);
			}, function(err){
				if (err.status === 401){
					//Error al querer logearlo con Twitter, el usuario no existe
					var properties = {
						host: config.host,
						port: config.port,
						path: '/user',
						body: user
					};

					//Creo el nuevo usuario con la data de Twitter.
					voluntaryMethods.post(user).then(function logInNewUser(user){
						
						//Logeo el user recien creado
						loginMethods.login({ twId: user.twitter.id }).then(function(resp){
						
							resp.twitter = user;
							deferred.resolve(resp);
						}, function(err){
						
							deferred.reject(err);
						});

					}, function(err){
						deferred.reject(err);
					});

				} else {
					deferred.reject(err);
				}
			});
		}, function(err){
			//error login twitter
			deferred.reject(err);
		});

		return deferred.promise;
	}


};