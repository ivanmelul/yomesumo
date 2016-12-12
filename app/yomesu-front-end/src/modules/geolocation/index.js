var geolocation = angular.module('geolocation', []);

geolocation.config(['$httpProvider', function($httpProvider) {
	// agrego interceptor para enviar la geolocalización en cada request
	$httpProvider.interceptors.push(['geolocationSvc', '$q', function(geolocationSvc, $q) {
		return  {
			'request': function(config) {
				var deferred = $q.defer();
				geolocationSvc.getLocation().then(function(position){
					var geolocationStr = 'latitude=' + position.latitude + '&longitude=' + position.longitude + '&accuracy=' + position.accuracy;
					config.headers['x-geolocation'] = geolocationStr;
					deferred.resolve(config);
				});

				return deferred.promise;
			}
		};
	}]);
}]);

// ni bien el módulo es cargado le pido al usuario que me diga su geolocalización
geolocation.run(['geolocationSvc',function(geolocationSvc){
	geolocationSvc.askForLocation();
}]);