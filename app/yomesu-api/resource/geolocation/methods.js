var Q = require('q'),
	request = require('../../utils/request')();

module.exports = {
	getLocation: function(ip) {
		var deferrer = Q.defer();
		// _dummyLocation lo uso por si no hay internet o se cae el servicio de localización
		// pongo la localización de la UTN FRBA
		var _dummyLocation = {
			latitude:-34.598781,
			longitude:-58.419927
		};
		var properties = {
			host: 'freegeoip.net',
			port: 80,
			path: '/json/' + ip
		};

		deferrer.resolve(_dummyLocation);
		// TEMPORAL PARA LA DEMO
		// request.get(properties).then(function getGeolocationSuccess(location){
		// 	if (location && location.latitude && location.longitude) {
		// 		deferrer.resolve(location);
		// 	} else {
		// 		deferrer.resolve(_dummyLocation);
		// 	}
		// }, function getGeolocationError(err){
		// 	console.log('Error en getGeolocationError:', err);
		// 	deferrer.resolve(_dummyLocation);
		// }).catch(function() {
		// 	console.log('Error 500 geolocation method:', err);
		// 	deferrer.resolve(_dummyLocation);
		// });

		return deferrer.promise;
	}
};