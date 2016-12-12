angular.module('ngo').controller('ngoListCtrl', ['$scope', 'ngoSvc', '$rootScope', function($scope, ngoSvc, $rootScope) {
	$scope.vm = {};
	$scope.vm.ngos = [];
	$scope.loading = true;
	$rootScope.loading = true;
	ngoSvc.get().then(function(ngos){
		for (var j = 0; j < ngos.length; j++) {
			// cargo una imagen por default
			ngos[j].image = ngos[j].image || '../images/manitos.png';
		}

		[].push.apply($scope.vm.ngos, ngos);
		$scope.loading = false;
	}).finally(function(){
		$rootScope.loading = false;
	});
}]);