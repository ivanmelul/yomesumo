
angular.module('mision').controller('missionListCtrl', ['$scope', 'misionSvc', function($scope, misionSvc) {
	$scope.vm = {};
	$scope.vm.missions = [];
	$scope.loading = true;

	misionSvc.get().then(function(missions){
		for (var j = 0; j < missions.length; j++) {
			// cargo una imagen por default
			missions[j].image = missions[j].image || '../images/manitos.png';
		}

		[].push.apply($scope.vm.missions, missions);
		$scope.loading = false;
	});
}]);