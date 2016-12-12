var voluntary = angular.module('voluntary', []);

voluntary.config(['$stateProvider','$mdThemingProvider',function($stateProvider, $mdThemingProvider) {

	$stateProvider.state('main.voluntaryList', {
		url: "/voluntaryList",
		views: {
			default:{
				templateUrl: 'templates/voluntaryList.html',
				controller: 'voluntaryListCtrl'
			}
		}
	});

	$mdThemingProvider.theme('misionCardTheme').primaryPalette('grey');
}]);

