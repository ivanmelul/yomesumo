angular.module('twitter').controller('twitterCtrl', ['$scope', 'twitterSvc', '$state', 'modalErrorSvc', '$window', 'sessionSvc', function($scope, twitterSvc, $state, modalErrorSvc, $window, sessionSvc){

	$scope.twLogin = function(){ 
		twitterSvc.getRedirectUrl().then(function(resp) {
			sessionSvc.setTwitterRequestTokens(resp.data.requestToken, resp.data.requestTokenSecret);
			$window.location.href = resp.data.redirect;
		}, function(error){
			modalErrorSvc({
				textContent: error
			});
		});
		return false;
	};

	//obtengo los datos de Twitter y los dejo en el modelo para que se guarden cuando el usuario clickee aceptar
	$scope.twConnect = function(){ 
		twitterSvc.connect().then(function(resp) {
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

	//saco los datos de Twitter del modelo para que se vacíen cuando el usuario clickee aceptar
	$scope.twDisconnect = function(){ 

		if ($scope.model){
			$scope.model = {};
		}
		return false;
	};
}]);