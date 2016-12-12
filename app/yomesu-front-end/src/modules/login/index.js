var login = angular.module('login', []);

login.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.login', {
		url: "/login",
		views: {
			default:{
				templateUrl: "templates/login.html",
				controller: 'loginCtrl'
			}
		}
	});
}]);