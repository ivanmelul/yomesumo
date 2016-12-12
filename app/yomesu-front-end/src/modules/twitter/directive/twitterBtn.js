angular.module('twitter').directive('twitterBtn', function() {
	return {
		restrict: 'E',
		scope: {
			model: '='
		},
		templateUrl:  function(elem, attr) { 
			if (attr.type === 'login')
				return 'templates/twitter-login.html'; 

			return 'templates/twitter-connect.html'; 
		},
		controller: 'twitterCtrl'
	};
});