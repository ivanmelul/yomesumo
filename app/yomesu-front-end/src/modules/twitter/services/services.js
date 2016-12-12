angular.module('twitter').service('twitterSvc' ,['$q', '$rootScope', '$location', '$http', '$window', 'appConfig', 'sessionSvc', function  ($q, $rootScope, $location, $http, $window, appConfig, sessionSvc)	{
	var api = {};
	var permissions = '';

	api.getRedirectUrl = function () {
		var deferred = $q.defer();
				
		$http.get(appConfig.backend + '/twitter/login').then(function(r){
			deferred.resolve(r);
		}, function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	};

	api.login = function(body){
		var deferred = $q.defer();
		
		$http.post(appConfig.backend + '/twitter/login', body).then(function (resp) {
			sessionSvc.setToken(resp.data);
			deferred.resolve(resp);
		}, function(resp) {
			deferred.reject('El login no se pudo realizar de manera correcta');
		});	

		return deferred.promise;
	};

	//TODO
	api.connect = function () {
		var deferred = $q.defer();
		
		//Obtengo los datos que necesito de FB
		FB.login(function(response){
			if (response.authResponse){
				//Devuelvo solo el userId y el token
				var toReturn = {
					token: response.authResponse.accessToken,
					id: response.authResponse.userID
				};
				deferred.resolve(toReturn);
			} else {
				//Si el usuario no acepto, devuelvo el error
				deferred.resolve('Debés aceptar la conexión con Facebook para continuar');
			}

		}, {scope: permissions});		

		return deferred.promise;
	};

	return api;
}]);