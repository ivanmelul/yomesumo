angular.module('things').service('thingsSvc' ,['$http', 'appConfig', '$q', function  ($http, appConfig, $q)	{

	this.get = function(filter){
		var query = '/things';
		if (filter)
			query = query + '?type=' + filter;

		return $http.get(appConfig.backend + query).then(function (resp) {
			console.log(resp.data);
			return resp.data;
		});
	};

}]);