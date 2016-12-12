var about = angular.module('about', []);

about.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.about', {
		url: "/about",
		views: {
			default:{
				templateUrl: "templates/about.html"
			}
		}
	});
}]);