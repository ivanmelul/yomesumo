angular.module('registro').service('registroSvc' ,['$http', 'sessionSvc', 'appConfig', function  ($http, sessionSvc, appConfig)	{
	this.registrar = function(mail, password) {
		return $http.post(appConfig.backend + '/voluntary', { mail: mail, password: password });
	};
}]);
