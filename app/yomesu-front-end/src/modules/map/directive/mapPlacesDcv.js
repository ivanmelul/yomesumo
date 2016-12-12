angular.module('map').directive('mapPlacesYomesu', ['$window', '$timeout', '$log', function($window, $timeout, $log) {
	return {
		restrict: 'E',
		scope: {
			markers:'=',
			onNewPlace:'='
		},
		templateUrl: 'templates/mapPlacesDcv.html',
		link: function(scope, element, attrs) {
			scope.markerClick = function(marker) {
				if (marker.onClick) {
					// paso la referencia del marker a la persona que me consume
					marker.onClick(marker);
				}
			};
			// el timeout es para esperar que el input se compile en el DOM
			$timeout(function(){
				var input = element[0].querySelector('.places-input');
				var autocomplete = new google.maps.places.Autocomplete(input);

				google.maps.event.addListener(autocomplete, 'place_changed', function () {
					// este timeout es xq este evento no es propio de angular, por lo que requiere disparar manualmente un ciclo de apply
					$timeout(function(){
						if (scope.onNewPlace) {
							scope.onNewPlace(autocomplete);
						} else {
							$log.log('Click event not defined');
						}
					});
				});

			});
		}
	};
}]);