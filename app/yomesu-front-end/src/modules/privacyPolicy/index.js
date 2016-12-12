var privacyPolicy = angular.module('privacyPolicy', []);

privacyPolicy.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.privacyPolicy', {
		url: "/privacyPolicy",
		views: {
			default:{
				templateUrl: "templates/privacyPolicy.html",
			}
		}
	});
}]);