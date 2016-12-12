var twitter = angular.module('twitter', []);

twitter.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.callback', {
		url: "/twitter/callback?{oauth_token}{oauth_verifier}",
		views: {
			default:{
				templateUrl: "templates/callback.html",
				controller: 'callbackCtrl'
			}
		}
	});
}]);
