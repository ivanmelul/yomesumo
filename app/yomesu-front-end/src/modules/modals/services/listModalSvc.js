angular.module('modals').factory('listModalSvc', ['$mdDialog', function  ($mdDialog) {
	return function displayModal(vm){
		var modal = $mdDialog.show({
			templateUrl: 'templates/listTemplate.html',
			clickOutsideToClose: true,
			locals: {
				vm: vm
			},
        	controller: ['$scope', '$mdDialog', 'vm', ModalCtrl]
    	});
        function ModalCtrl($scope, $mdDialog, vm) {
	        $scope.items = vm.items;
	        $scope.title = vm.title;
	        $scope.closeDialog = function() {
				$mdDialog.hide();
        	};
      	}
	};
}]);