angular.module('map').directive('mapYomesu', ['$window', '$timeout', function($window, $timeout) {
	return {
		restrict: 'E',
		scope: {
			markers:'=',
			getMarkerReference:'='
		},
		templateUrl: 'templates/mapDcv.html',
		link: function(scope, element, attrs) {
			// esto me permite tener mas de un mapa funcionando en una misma pantalla
			scope.uid = Math.floor(Math.random() * 10000);
			// aca se guarda la referencia de todos los markers
			$timeout(function(){
				var _markers = [];
				var _map;
				var _coordenadasDeLaUTNFRBA = {lat:-34.598602, lng:-58.420167};
				function init(){
					_map = new google.maps.Map($window.document.getElementById('map' + scope.uid), {
						center: new google.maps.LatLng(_coordenadasDeLaUTNFRBA.lat, _coordenadasDeLaUTNFRBA.lng),
						zoom: 4,
						scrollwheel:false,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					});
				}
				scope.$watchCollection('markers',function(newVal){
					if (newVal) {
						clearAllMarkers();
						addAllMarkers();
						centerMap();
					}
				});
				function clearAllMarkers() {
					for (var i = 0; i < _markers.length; i++) {
						_markers[i].setMap(undefined);
					}
					_markers.length = 0;
				}
				function addAllMarkers(){
					var markerClick = function (marker) {
						var that = this;
						// el timeout es para ejecutar un ciclo de apply, ya que, google maps no es angular
						$timeout(function(){
							if (that.onClick) {
								// paso la data y la referencia del marker a la persona que me consume
								that.onClick(that, marker);
							}
						});
					};
					var markerAnimate = function(val){
						if(val) {
							this.setAnimation(google.maps.Animation.BOUNCE);
						} else {
							this.setAnimation(null);
						}
					};
					
					//scope.markers[i].unbindWatch = scope.$watch('markers',markerAnimate.bind(marker));
					for (var i = 0; i < scope.markers.length; i++) {
						var marker = new google.maps.Marker({
							title: scope.markers[i].title
						});
						marker.setPosition(new google.maps.LatLng(scope.markers[i].position.lat, scope.markers[i].position.lng));
						marker.setMap(_map);
						marker.addListener('click', markerClick.bind(scope.markers[i], marker));
						
						// esta linea genera problemas de recursividad al guardar la mision
						if(scope.getMarkerReference) {
							scope.markers[i].marker = marker;
						}

						_markers.push(marker);
					}
				}
				function centerMap(){
					var latlngbounds = new google.maps.LatLngBounds();
					for (var i = 0; i < _markers.length; i++) {
						latlngbounds.extend(_markers[i].position);
					}
					_map.fitBounds(latlngbounds);
				}
				init();
			});
		}
	};
}]);