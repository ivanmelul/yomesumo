var mision = angular.module('mision', []);


mision.config(['$stateProvider','$mdThemingProvider',function($stateProvider, $mdThemingProvider){

	$stateProvider.state('main.missionDetail', {
		url: "/mission?id",
		views: {
			default:{
				templateUrl: 'templates/misionDetail.html',
				controller: 'misionDetailCtrl'
			}
		}
	}).state('main.missionList', {
		url: "/missionList",
		views: {
			default:{
				templateUrl: 'templates/missionList.html',
				controller: 'missionListCtrl'
			}
		}
	});

	$mdThemingProvider.theme('misionCardTheme').primaryPalette('grey');
}]);

