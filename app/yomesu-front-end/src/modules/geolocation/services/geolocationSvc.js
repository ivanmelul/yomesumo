angular.module('geolocation').factory('geolocationSvc' ,['$log', '$q', function ($log, $q)	{
	var api = {};

	var _position = {
		latitude: null,
		longitude: null,
		accuracy: null
	};

	api.askForLocation = function() {
		var deferred = $q.defer();
		if (navigator && navigator.geolocation) {
			// NOTA: TENER EN CUENTA QUE ESTO FUNCIONA SI EL WEB SERVER TIENE UN SSL INSTALADO (HTTPS)
			/*navigator.geolocation.getCurrentPosition(function successFunction(position) {
				_position.latitude = position.coords.latitude;
				_position.longitude = position.coords.longitude;
				_position.accuracy = position.coords.accuracy;
				deferred.resolve();
			}, function errorFunction(){
				$log.info('User doesn\'t accept the geolocation request');
				deferred.reject();
			});*/
deferred.resolve();
		} else {
			$log.info('Browser doesn\'t support geolocation');
			deferred.reject();
		}
		return deferred.promise;
	};
	api.getLocation = function(){
		return api.askForLocation().then(function(){
			return _position;
		});
	};	

	return api;
}]);