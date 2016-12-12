angular.module('voluntary').controller('voluntaryListCtrl', ['$scope', 'voluntarySvc', '$window', '$rootScope', function($scope, voluntarySvc, $window, $rootScope) {
	$scope.vm = {};
	$scope.vm.voluntaries = [];
	$scope.loading = true;
	$rootScope.loading = true;

	voluntarySvc.get().then(function(voluntaries){
		for (var j = 0; j < voluntaries.length; j++) {
			// cargo una imagen por default
			voluntaries[j].image = voluntaries[j].image || '../images/manitos.png';
		}

		[].push.apply($scope.vm.voluntaries, voluntaries);

	}).finally(function(){
		$rootScope.loading = false;
		$scope.loading = false;
	});
	$scope.openTwitter = function(username){
		$window.open('//www.twitter.com/' + username);
	};
	$scope.openFacebook = function(username){
		$window.open('//facebook.com/' + username);
	};
}]);