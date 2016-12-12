angular.module('registro').controller('registroCtrl', ['$scope', 'registroSvc', '$state', 'modalErrorSvc', '$mdDialog', '$window', '$rootScope', function($scope, registroSvc, $state, modalErrorSvc, $mdDialog, $window, $rootScope){
	$scope.vm = {};

	$scope.registrar = function() {
		$rootScope.loading = true;
		registroSvc.registrar($scope.vm.mail, $scope.vm.password).then(function(re) {
			$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element($window.document.body))
					.clickOutsideToClose(true)
					.title('Yo me sumo!')
					.textContent('Operación exitosa, ya podés sumarte a las misiones!')
					.ariaLabel('Operacion exitosa')
					.ok('Aceptar')).then(function(){
						$state.go('main.login', {}, { reload: true });
					});
		}, function(error){
			modalErrorSvc({
				textContent: error.data
			});
		}).finally(function(){
			$rootScope.loading = false;
		});
	};
}]);