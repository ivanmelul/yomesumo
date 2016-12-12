angular.module('ngo').service('ngoSvc' ,['$http', 'appConfig', '$q', function  ($http, appConfig, $q)	{
	this.getById = function(id) {
		return $http.get(appConfig.backend + '/ong?_id=' + id).then(function (resp) {
			var ngo;

			if (resp.data && resp.data.length > 0) {
				ngo = resp.data[0];
			}

			return ngo;
		});
	};
	this.get = function(filter){
		return $http.get(appConfig.backend + '/ong?').then(function (resp) {
			return resp.data;
		});
	};
	this.update = function(ngo) {
		// borro las misiones porque eso se guarda en otra parte y me sobre carga el payload
		var ngoToSend = angular.copy(ngo);
		delete ngoToSend.missions;
		return $http.put(appConfig.backend + '/ong', ngoToSend).then(function (resp) {
			return resp.data;
		});
	};

	this.getCurrent = function() {
		return $http.get(appConfig.backend + '/ong/current').then(function (resp) {
			return resp.data;
		}, function(resp) {
			// temporal
			console.log(resp);
		});
	};

}]);