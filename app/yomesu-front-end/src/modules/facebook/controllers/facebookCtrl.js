angular.module('facebook').controller('facebookCtrl', ['$scope', 'facebookSvc', '$state', 'modalErrorSvc', function($scope, facebookSvc, $state, modalErrorSvc){
	
	console.log('model');
	console.log($scope.model);
	$scope.fbLogin = function(){ 
		facebookSvc.login().then(function(resp) {
			$state.go('main.home', {}, { reload: true });
		}, function(error){
			modalErrorSvc({
				textContent: error
			});
		});
		return false;
	};

	//obtengo los datos de facebook y los dejo en el modelo para que se guarden cuando el usuario clickee aceptar
	$scope.fbConnect = function(){ 
		facebookSvc.connect().then(function(resp) {
			if ($scope.model){
				$scope.model.id = resp.id;
				$scope.model.token = resp.token;
			}

		}, function(error){
			modalErrorSvc({
				textContent: error
			});
		});
		return false;
	};

	//saco los datos de facebook del modelo para que se vacíen cuando el usuario clickee aceptar
	$scope.fbDisconnect = function(){ 

		if ($scope.model){
			$scope.model = {};
		}
		return false;
	};
}]);