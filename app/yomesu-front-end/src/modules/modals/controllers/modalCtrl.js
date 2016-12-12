angular.module('modals').controller('modalCtrl', '$mdDialog', 'items', ['$scope', function($scope, $mdDialog, items){
	
	$scope.items = items;
	$scope.closeDialog = function() {
		$mdDialog.hide();
	};	
}]);