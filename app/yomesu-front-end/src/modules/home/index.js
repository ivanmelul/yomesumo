var home = angular.module('home', []);

home.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.home', {
		url: "/home",
		views: {
			default:{
				templateUrl: "templates/home.html",
				controller: 'homeCtrl'
			}
		}
	});
}]);