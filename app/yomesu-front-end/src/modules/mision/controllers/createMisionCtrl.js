// este controller se utiliza tanto como para crear como para modificar
angular.module('mision').controller('createMisionCtrl', ['$scope', '$mdDialog', 'misionSvc', '$location', 'currentMission', 'imagesSvc', '$window', '$timeout', 'NgMap', 'thingsSvc', '$rootScope', function($scope, $mdDialog, misionSvc, $location, currentMission, imagesSvc, $window, $timeout, NgMap, thingsSvc, $rootScope) {
	// esto define si estoy creando o modificando, después en el be se realiza el put o post según se tenga o no _id en la misión
	$scope.vm = currentMission || {};

	$scope.vm.hashTags = $scope.vm.hashTags || [];
	$scope.vm.stages = $scope.vm.stages || [];

	// leo del querystring
	$scope.vm.ong = $location.search().id;

	thingsSvc.get().then(function getSuccess(things){
		$scope.allRequiredThings = things;
	});


	$scope.addStage = function() {
		if ($scope.newStageName && $scope.newStageName.length) {
			var newStage = {
				name: $scope.newStageName,
				hashTags: [],
				requiredThings: [],
				markers:[],
				onNewPlace: onNewPlaceEvent
			};
			$scope.vm.stages.push(newStage);
			$scope.newStageName = '';

			$timeout(function(){
				google.maps.event.trigger($window.document, "resize");	
			});
		}
	};
	$scope.removeStage = function(stage) {
		$scope.vm.stages.splice($scope.vm.stages.indexOf(stage), 1);
	};

	$scope.save = function() {
		
		var url = ($scope.files01 && $scope.files01.length > 0) ? $scope.files01[0].lfDataUrl : '';

		$rootScope.loading = true;
		$scope.loading = true;
		imagesSvc.getBase64FromImageUrl(url).then(function getBase64Success(base64Data){
			$scope.vm.image = base64Data;
			misionSvc.save($scope.vm).then(function saveMisionSuccess(resp){
				$mdDialog.hide(resp);
			}, function saveMisionError(err){
				// temporal
				console.log(err);
			}).finally(function(){
				$rootScope.loading = false;
				$scope.loading = false;
			});
		}, function getBase64Error(err) {
			// temporal
			console.error(err);
			$rootScope.loading = false;
			$scope.loading = false;
		});
	};


	$scope.chipClick = function(chip) {
		chip.urgency++;
		if (chip.urgency > 2) {
			chip.urgency = 0;
		}
	};

	$scope.createChip = function(chip) {
		// la urgencia por default es 1
		return angular.extend({urgency: 1}, chip);
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.getRequiredThingsMatches = function(search) {
		var upper = search.toUpperCase();
		return $scope.allRequiredThings.filter(function requiredThingsFilter(item){
			return (~item.name.toUpperCase().indexOf(upper) || ~item.category.toUpperCase().indexOf(upper));
		}).sort(function(item){
			return item.name.toUpperCase().indexOf(upper);
		});
	};

	$scope.$watch('files01[0].lfFileName',function() {
		var url = ($scope.files01 && $scope.files01.length > 0) ? $scope.files01[0].lfDataUrl : '';
		imagesSvc.getBase64FromImageUrl(url).then(function getBase64Success(base64Data){
			$scope.vm.image = base64Data;
		});
	});

	// esta funcion agrega y modifica datos necesarios para mostrar los datos en la vista, y que no rompa
	function prepareDataToView() {
		// 80% seguro que el parametro 'marker' y 'this'(el contexto) van a ser los mismos, pero paja verificarlo ahora
		var onClickEvent = function(marker) {
			this.markers.splice(this.markers.indexOf(marker), 1);
		};

		$scope.vm.startDate = (typeof $scope.vm.startDate === 'string') ? new Date($scope.vm.startDate) : new Date();
		$scope.vm.endDate = (typeof $scope.vm.endDate === 'string') ? new Date($scope.vm.endDate) : new Date();

		if ($scope.vm.stages) {
			for (var i = 0; i < $scope.vm.stages.length; i++) {
				$scope.vm.stages[i].startDate = (typeof $scope.vm.stages[i].startDate === 'string') ? new Date($scope.vm.stages[i].startDate) : new Date();
				$scope.vm.stages[i].endDate = (typeof $scope.vm.stages[i].endDate === 'string') ? new Date($scope.vm.stages[i].endDate) : new Date();

				if (!$scope.vm.stages[i].onNewPlace) {
					$scope.vm.stages[i].onNewPlace = onNewPlaceEvent.bind($scope.vm.stages[i]);
				}
				$scope.vm.stages[i].hashTags = $scope.vm.stages[i].hashTags || [];
				$scope.vm.stages[i].requiredThings = $scope.vm.stages[i].requiredThings || [];
				$scope.vm.stages[i].markers = $scope.vm.stages[i].markers || [];

				for (var j = 0; j < $scope.vm.stages[i].markers.length; j++) {
					$scope.vm.stages[i].markers[j].onClick = onClickEvent.bind($scope.vm.stages[i]);
				}

			}
		}
	}


	function onNewPlaceEvent(autocomplete){
		var place = autocomplete.getPlace();
		var that = this;
		this.markers.push({
			title: place.name,
			position: {
				lat:place.geometry.location.lat(),
				lng:place.geometry.location.lng()
			},
			// 80% seguro que el parametro 'marker' y 'that'(el contexto) van a ser los mismos, pero paja verificarlo ahora
			onClick: function(marker){
				// saco el marker clickeado del array
				that.markers.splice(that.markers.indexOf(marker), 1);
			}
		});
	}


	prepareDataToView();
}]);