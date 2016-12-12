angular.module('login').controller('loginCtrl', ['$scope', 'loginSvc', '$state', 'modalErrorSvc', '$rootScope', '$location', function($scope, loginSvc, $state, modalErrorSvc, $rootScope, $location){
	$scope.vm = {};

	//si por parametro viene que no acepto la integracion con twitter, muestro cartel
	if ($location.search().na){
		modalErrorSvc({	textContent: 'Debes aceptar la integración con Twitter para iniciar sesión' });
	}

	$scope.login = function() {
		$rootScope.loading = true;
		loginSvc.login($scope.vm.username, $scope.vm.password).then(function(re){
			$state.go('main.home', {}, { reload: true });
		}, function(error){
			modalErrorSvc({
				title:'¡Ups!',
				textContent: error
			});
		}).finally(function(){
			$rootScope.loading = false;
		});
	};

	$scope.registro = function(){
		$state.go('main.registro', {}, { reload: true });
	};
}]);