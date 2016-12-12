angular.module('facebook').service('facebookSvc' ,['$q', '$rootScope', '$location', '$http', '$window', 'appConfig', 'sessionSvc', function  ($q, $rootScope, $location, $http, $window, appConfig, sessionSvc)	{
	var api = {};
	var permissions = '';

	api.login = function () {
		var deferred = $q.defer();
		
		//Obtengo los datos que necesito de FB
		FB.login(function(response){
			if (response.authResponse){
				//Le mando al BE de FB la data necesaria para que empiece a laburar
				var params = {status: response.status, auth: response.authResponse};

				$http.post(appConfig.backend + '/fb/login', params).then(function(r){
					sessionSvc.setToken(r.data);
					deferred.resolve(r);
				}, function(err){
					deferred.reject(err);
				});
			} else {
				//Si el usuario no acepto, devuelvo el error
				deferred.resolve('Debés aceptar la conexión con Facebook para continuar');
			}
		}, {scope: permissions});		

		return deferred.promise;
	};

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

	api.init = function(fbConfig){
		$window.fbAsyncInit = function() {
			permissions = fbConfig.permissions;
		    FB.init({
		      appId      : fbConfig.appId,
		      cookie     : true,
		      xfbml      : true,
		      version    : fbConfig.version
		    });
		};
		// codigo magico de facebook
		(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
		}($window.document, 'script', 'facebook-jssdk'));
	};
	
	$http.get(appConfig.backend + '/fb/login').then(function(response){
		console.log(appConfig);
		console.log(response.data);
		api.init(response.data);
	});

	return api;
}]);