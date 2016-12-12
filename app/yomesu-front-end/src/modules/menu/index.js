var menu = angular.module('menu', []);
menu.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.menu', {
		controller: 'menuCtrl'
	});
}]);