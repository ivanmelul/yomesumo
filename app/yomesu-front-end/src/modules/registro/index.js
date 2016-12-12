var registro = angular.module('registro', ['ngPassword']);

registro.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.registro', {
		url: "/registro",
		views: {
			default:{
				templateUrl: "templates/registro.html",
				controller: 'registroCtrl'
			}
		}
	});
}]);