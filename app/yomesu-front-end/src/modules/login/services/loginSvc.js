angular.module('login').service('loginSvc' ,['$http', 'sessionSvc', 'appConfig', '$q', function  ($http, sessionSvc, appConfig, $q)	{
	this.login = function(username, password) {
		return $http.post(appConfig.backend + '/login', {username: username, password:password}).then(function (resp) {
			sessionSvc.setToken(resp.data);
		}, function(resp) {
			return $q.reject('El usuario y/o contraseña no son correctos');
		});
	};
	this.logout = function(tck) {
		return $http.get(appConfig.backend + '/login/logout?token=' + tck).then(function (resp) {
			console.log('Deslogueo realizado de forma exitosa');
		}, function(resp) {
			return $q.reject('Error con el deslogueo: ', resp);
		});
	};
}]);
