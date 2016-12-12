// nota: missionPrm se define en missionCardDvc, tiene la informacion de la misión seleccionada
angular.module('mision').controller('misionDetailCtrl', ['$scope', 'misionSvc', '$location', 'voluntarySvc', 'modalErrorSvc', '$mdDialog', '$window', '$timeout', '$rootScope', function($scope, misionSvc, $location, voluntarySvc, modalErrorSvc, $mdDialog, $window, $timeout, $rootScope){
	$scope.vm = {};
	// leo del querystring
	$scope.getMissionData = function(){
		var _id = $location.search().id;
		$scope.loading = true;
		misionSvc.getById(_id).then(function(mission){
			angular.extend($scope.vm, mission);
			// cargo una imagen por default
			$scope.vm.image = $scope.vm.image || '../images/manitos.png';
		}).finally(function(){
			$scope.loading = false;
		});
	};

	$scope.yoMeSumo = function(mission, stage) {
		voluntarySvc.getCurrent().then( function getCurrent(user) {
			var content = 'Te estas a punto de sumar a la ';
			if (stage) {
				content += 'etapa ' + stage.name + ' de la ';
			}
			content += 'misión ' + mission.name + '. \n\r';

			var confirm = $mdDialog.confirm()
				.title('¿Estás seguro que quieres sumarte?')
				.textContent(content)
				.ariaLabel('Confirmar sumarse')
				.ok('¡Yo me sumo!')
				.cancel('Cancelar')
				.clickOutsideToClose(true);

			$mdDialog.show(confirm).then(function() {
				$rootScope.loading = true;
				
				misionSvc.yoMeSumo(mission, stage, user).then(function(resp){
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element($window.document.body))
						.clickOutsideToClose(true)
						.title('¡Ya estas sumado a la misión!')
						.textContent('En breve, recibiras un mail con más información')
						.ariaLabel('Operacion exitosa')
						.ok('Aceptar'));

					$scope.getMissionData();
				}, function(err){
					modalErrorSvc({
						title: '¡Ups!',
						textContent: err
					});
				}).finally(function(){
					$rootScope.loading = false;
				});
			}, function() {
				// no hacer nada
			});			
		}, function getCurrentError(msg){
			modalErrorSvc({
				title: '¡Ups!',
				textContent: 'Tiene que estar loguedo para realizar esa acción'
			});
		});

	};

	$scope.getMissionData();
}]);