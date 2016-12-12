angular.module('voluntary').service('voluntarySvc' ,['$http', 'appConfig', '$httpParamSerializer', '$q', 'sessionSvc', function  ($http, appConfig, $httpParamSerializer, $q, sessionSvc) {
	var _currentVoluntar;
	this.get = function(filter) {
		return $http.get(appConfig.backend + '/voluntary?' + $httpParamSerializer(filter)).then(function (resp) {
			return resp.data;
		}, function(resp) {
			// temporal
			console.log(resp);
		});
	};
	this.getCurrent = function() {
		var deferred = $q.defer();

		if (sessionSvc.getToken()) {
			// me fijo si tengo la información cacheada
			if (!_currentVoluntar) {
				$http.get(appConfig.backend + '/voluntary/current').then(function (resp) {
					_currentVoluntar = resp.data;
					deferred.resolve(_currentVoluntar);
				}, function(resp) {
					// temporal
					deferred.reject(resp);
				});
			} else {
				deferred.resolve(_currentVoluntar);
			}
		} else {
			deferred.reject('No token found');
		}
		
		return deferred.promise;
	};
}]);