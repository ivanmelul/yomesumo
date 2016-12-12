angular.module('facebook').directive('facebookBtn', function() {
	return {
		restrict: 'E',
		scope: {
			model: '='
		},
		templateUrl:  function(elem, attr) { 
			if (attr.type === 'login')
				return 'templates/facebook-login.html'; 

			return 'templates/facebook-connect.html'; 
		},
		controller: 'facebookCtrl'
	};
});