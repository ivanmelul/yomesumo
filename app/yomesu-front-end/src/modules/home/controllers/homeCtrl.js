angular.module('home').controller('homeCtrl', ['$scope', 'misionSvc', '$location', '$anchorScroll', '$rootScope', '$window','$document', function($scope, misionSvc, $location, $anchorScroll, $rootScope, $window, $document){
	$scope.vm = {};

	// set initial values
	$scope.vm.gridSizeMd = 2;
	$scope.vm.gridSizeLg = 2;
	$scope.vm.missions = [];
	$scope.vm.markers = [];
	$scope.vm.social = [];

	$scope.vm.loading = true;
	$rootScope.loading = true;
	
	misionSvc.getForHome().then(function(missions){
		var currentStage;
		var markerOnClick = function(mission, marker) {
			// NOTA: mission._id no me dice nada

			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				var cardContent = angular.element($window.document.querySelector('.mision-grid'));
				var cardElement = angular.element($window.document.getElementById(mission.mission._id));
				cardContent.scrollToElement(cardElement, 0, 500);
			}

			$scope.vm.selectedId = mission.mission._id;
		};

		if (missions) {
			var j;
			for (var i = 0; i < missions.length; i++) {

				for (j = 0; j < missions.length; j++) {
					// cargo una imagen por default
					missions[j].image = missions[j].image || '../images/manitos.png';
				}

				// cargo el marker para que se muestre en el mapa de la home
				for (j = 0; j < missions[i].stages.length; j++) {
					currentStage = missions[i].stages[j];
					for (var k = 0; k < currentStage.markers.length; k++) {
						// guardo la referencia de la mision a la cual pertenece el marker.
						// lo uso para que al momento de hacer click en uno, pueda mostrar más informacion
						// NOTA: tener en cuenta que esto puede generar dependencias circulares
						currentStage.markers[k].mission = missions[i];

						currentStage.markers[k].onClick = markerOnClick;
						$scope.vm.markers.push(currentStage.markers[k]);
					}
				}
				[].push.apply($scope.vm.social, missions[i].media);
			}
			[].push.apply($scope.vm.missions, missions);
		}
		$scope.vm.social = $scope.vm.social.sort(function(a, b){
			return new Date(b.date) - new Date(a.date);
		});
	}).finally(function(){
		$scope.vm.loading = false;
		$rootScope.loading = false;
	});


	var scrollContentEl = angular.element($window.document.querySelector('.mision-grid'));
	var _previousCurrentCard = -2;
	scrollContentEl.on('scroll',function() {
		var doc = $window.document.querySelector('.mision-grid');
		var cardHeight = $window.document.querySelector('.mision-grid .container mision-card').clientHeight;
		var cardMargin = 8;
		var cardHeightTotal = cardHeight + cardMargin;
		var top = ($window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		var i, j, marker, stage;
		var currentCard = Math.floor(top / cardHeightTotal);

		// para cuando arrastras el scroll para arriba en algunos mobiles
		if (currentCard < 0){
			currentCard = 0;
		}

		if (_previousCurrentCard !== currentCard) {
			$scope.vm.missions[currentCard].current = true;
			if (_previousCurrentCard >= 0) {
				$scope.vm.missions[_previousCurrentCard].current = false;

				// des-animo todos los markers de la mision
				if ($scope.vm.missions[_previousCurrentCard].markers) {
					for (i = 0; i < $scope.vm.missions[_previousCurrentCard].markers.length; i++) {
						marker = $scope.vm.missions[_previousCurrentCard].markers[i];
						marker.setAnimation(null);
					}
				}
				// des-animo todos los markers de las etapas
				for (i = $scope.vm.missions[_previousCurrentCard].stages.length - 1; i >= 0; i--) {
					stage = $scope.vm.missions[_previousCurrentCard].stages[i];
					for (j = 0; j < stage.markers.length; j++) {
						stage.markers[j].marker.setAnimation(null);
					}
				}
			}

			// animo todos los markers de la mision
			if ($scope.vm.missions[currentCard].markers) {
				for (i = 0; i < $scope.vm.missions[currentCard].markers.length; i++) {
					marker = $scope.vm.missions[currentCard].markers[i];
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			}
			// animo todos los markers de las etapas
			for (i = $scope.vm.missions[currentCard].stages.length - 1; i >= 0; i--) {
				stage = $scope.vm.missions[currentCard].stages[i];
				for (j = 0; j < stage.markers.length; j++) {
					stage.markers[j].marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			}
			
			

			_previousCurrentCard = currentCard;
		}
	});

	$rootScope.$watch('vm.searchText',function(newVal){
		console.log('TODO: disparar una nueva busqueda', newVal);
	});
}]);