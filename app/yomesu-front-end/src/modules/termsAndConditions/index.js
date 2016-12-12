var termsAndConditions = angular.module('termsAndConditions', []);

termsAndConditions.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.termsAndConditions', {
		url: "/termsAndConditions",
		views: {
			default:{
				templateUrl: "templates/termsAndConditions.html",
			}
		}
	});
}]);