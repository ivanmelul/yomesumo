var profile = angular.module('profile', []);

profile.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.profile', {
		url: "/profile?id",
		views: {
			default:{
				templateUrl: "templates/profile.html",
				controller: 'profileCtrl'
			}
		}
	});
}]);