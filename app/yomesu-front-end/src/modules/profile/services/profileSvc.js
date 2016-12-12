angular.module('profile').service('profileSvc' ,['$http', 'appConfig', '$q', function  ($http, appConfig, $q)	{
	this.get = function(id) {
		return $http.get(appConfig.backend + '/voluntary?_id=' + id).then(function (resp) {
			var voluntary;
			
			if (resp.data && resp.data.length > 0) {
				voluntary = resp.data[0];
			}

			return voluntary;
		});
	};

	this.save = function(voluntary){
		return $http.put(appConfig.backend + '/voluntary', voluntary).then(function (resp) {
			//TODO: Devolver algo lindo
			var voluntary;
			
			if (resp.data && resp.data.length > 0) {
				voluntary = resp.data[0];
			}

			return voluntary;
		});
	};
}]);