var ngo = angular.module('ngo', []);

ngo.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.ngo', {
		url: "/ngo?id",
		views: {
			default:{
				templateUrl: "templates/ngo.html",
				controller: 'ngoCtrl'
			}
		},
		params: {
			id: null
		}
	}).state('main.ngoList', {
		url: "/ngoList",
		views: {
			default:{
				templateUrl: "templates/ngoList.html",
				controller: 'ngoListCtrl'
			}
		},
		params: {
			id: null
		}
	});
}]);