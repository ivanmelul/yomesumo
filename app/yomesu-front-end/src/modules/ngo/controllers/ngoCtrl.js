angular.module('ngo').controller('ngoCtrl', ['$scope', '$mdDialog', 'ngoSvc', '$location', '$window', 'modalErrorSvc', '$mdMedia', '$q', 'voluntarySvc', 'imagesSvc', 'misionSvc', '$rootScope', function($scope, $mdDialog, ngoSvc, $location, $window, modalErrorSvc, $mdMedia, $q, voluntarySvc, imagesSvc, misionSvc, $rootScope) {
	$scope.vm = {};
	$scope.loading = true;
	$rootScope.loading = true;
	// leo del querystring
	var _id = $location.search().id;
	ngoSvc.getById(_id).then(function(ngo){
		if (ngo.missions) {
			for (var i = 0; i < ngo.missions.length; i++) {
				// les cargo una imagen por default en caso de no tener una
				ngo.missions[i].image = ngo.missions[i].image || '../images/manitos.png';
			}
		}
		angular.extend($scope.vm, ngo);
		$scope.loading = false;
		$rootScope.loading = false;
	});
	// obtengo todos los voluntarios para el control de chips
	// TODO: debería traer información restringida (no toda la data del voluntario como ahora)
	voluntarySvc.get().then(function (voluntaries){
		$scope.allVoluntaries = voluntaries;
	});
	// aqui se guardan la info de los voluntarios lideres
	$scope.vm.leaderVoluntary = [];

	// obtengo quienes son los voluntarios lideres
	voluntarySvc.get({ngos:_id}).then(function (voluntaries){
		[].push.apply($scope.vm.leaderVoluntary, voluntaries);
	});

	$scope.deleteMission = function(mission, ev) {
		var confirm = $mdDialog.confirm()
		.title('¿Esta seguro que desea eliminar la misión?')
		.textContent('Todas las etapas, y actividades relacionadas con esta misión se eliminarán')
		.ariaLabel('Confirmar eliminación')
		.targetEvent(ev)
		.ok('Confirmar')
		.cancel('Cancelar')
		.clickOutsideToClose(true);

		$mdDialog.show(confirm).then(function() {
			misionSvc.delete(mission).then(function() {
				$scope.vm.missions.splice($scope.vm.missions.indexOf(mission), 1);
				console.log('Mission borrada correctamente');
			}, function(){
				console.log('Mission NO borrada correctamente');
			});
		}, function() {
			// no hacer nada
		});
	};

	$scope.update = function(ev){
		var url = ($scope.files01 && $scope.files01.length > 0) ? $scope.files01[0].lfDataUrl : '';

		$rootScope.loading = true;
		imagesSvc.getBase64FromImageUrl(url).then(function(base64Data){
			$scope.vm.image = base64Data;
			ngoSvc.update($scope.vm).then(function updateNgo(data){
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element($window.document.body))
					.clickOutsideToClose(true)
					.title('ONG')
					.textContent(data)
					.ariaLabel('Operacion exitosa')
					.ok('Aceptar')
					.targetEvent(ev)
				);
			}, function updateNgoError() {
				modalErrorSvc({
					textContent: 'Error al intentar actualizar la ONG'
				});
			}).finally(function(){
				$rootScope.loading = false;
			});
		});
	};

	$scope.createMission = function(ev) {
		// el create se hace dentro del dialog
		var newMission = {};
		openDialog(newMission, ev).then(function createMissionAccept(answer) {
			$scope.vm.missions.push(newMission);
			var alert = $mdDialog.alert({
				title: 'Misión',
				textContent: '¡La misión se creó de forma correcta!',
				ok: 'Cerrar'
			});

			$mdDialog
			.show( alert )
			.finally(function() {
					alert = undefined;
			});
			
		},function createMissionCancel(cancel) {
			//do nothing
		});
	};
	$scope.editMission = function(mission, ev){
		var missionCpy = angular.copy(mission);
		// el actualizar se hace dentro del dialog
		openDialog(missionCpy, ev).then(function editMissionAccept(answer) {
			angular.extend(mission, missionCpy);
			//TODO: LLAMAR AL DIALOG ACA
		}, function editMissionCancel(cancel) {
			//do nothing
		});
	};

	function openDialog(mission, ev) {
		// hardcodeado para que el modal sea bien grande
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) || true;
		return $mdDialog.show({
			templateUrl: 'templates/createMision.html',
			controller:'createMisionCtrl',
			locals: {
				currentMission: mission
			},
			parent: angular.element($window.document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			fullscreen: useFullScreen
		});
	}

	$scope.getVoluntaryMatches = function(search) {
		var upper = search.toUpperCase();
		return $scope.allVoluntaries.filter(function voluntaryFilter(item){
			var resp;
			// busco por nombre de usuario
			resp = item.username && ~item.username.toUpperCase().indexOf(upper);
			// en caso de no machear, verifico con el mail
			resp = resp || (item.mail && ~item.mail.toUpperCase().indexOf(upper));
			return resp;
		});
	};
}]);