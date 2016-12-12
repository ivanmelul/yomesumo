angular.module('modals').factory('modalSvc', ['$mdDialog', function  ($mdDialog) {
	return function displayModal(vm){
		var modal = $mdDialog.show({
			templateUrl: 'templates/modal.html',
			clickOutsideToClose: true,
			locals: {
				vm: vm
			},
        	controller: ModalCtrl
    	});
        function ModalCtrl($scope, $mdDialog, vm) {
	        $scope.title = vm.title;
	        $scope.text = vm.text;
	        $scope.closeDialog = function() {
				$mdDialog.hide();
        	};
      	}
	};
}]);