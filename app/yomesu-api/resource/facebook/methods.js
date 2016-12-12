var config = require('./config'),
	Q = require('q'),
	loginMethods = require('../login/methods'),
	voluntaryMethods = require('../voluntary/methods'),
	request = require('../../utils/request')();

module.exports = {

	get: function(path) {
		var deferred = Q.defer();

		var properties = {
			host: config.host,
			port: config.port,
			path: path
		};

		request.get(properties).then(function(resp){
			deferred.resolve(resp);
		}, function(err){
			deferred.reject(err);
		});
		
		return deferred.promise;
	},

	post: function(path, body) {
		var deferred = Q.defer();

		var properties = {
			host: config.host,
			port: config.port,
			path: path,
			body: body
		};

		request.post(properties).then(function(resp){
			deferred.resolve(resp);
		}, function(err){
			deferred.reject(err);
		});
		
		return deferred.promise;
	},

	login: function(fbObject){
		var deferred = Q.defer();
		var fbMethods = this;

		var fb = {fbData: fbObject};
		//Me guardo el access token para determinados acciones (se encuentra en proceso de fb 'fbMethods.get('/login')' )
		fbMethods.get('/login').then(function(resp){
			fb.fbInfo = resp;

			//Primero intento logearlo con el fbId
			loginMethods.login({ fbId: fbObject.auth.userID } ).then(function logInFromFB(resp){
				resp.fb = fb;
				deferred.resolve(resp);
			}, function(err){
				if (err.status === 401){
					//Error al querer logearlo con FB, el usuario no existe
					//Obtengo todos los datos de FB que necesito para registrarlo
					var properties = {
						host: config.host,
						port: config.port,
						path: '/user',
						body: fbObject
					};

					request.post(properties).then(function createNewUser(user){
						//Creo el nuevo usuario con la data de FB.
						voluntaryMethods.post(user).then(function logInNewUser(user){
							
							//Logeo el user recien creado
							loginMethods.login({ fbId: user.fb.id }).then(function(resp){
								resp.fb = fb;
								deferred.resolve(resp);
							}, function(err){
								deferred.reject(err);
							});

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
			//error login fb
			deferred.reject(err);
		});
		return deferred.promise;
	}
};