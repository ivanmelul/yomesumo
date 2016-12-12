angular.module('mision').directive('misionCard', ['$mdDialog', '$mdMedia', '$window', '$state', function($mdDialog, $mdMedia, $window, $state) {
	return {
		restrict: 'E',
		scope: {
			mission:'='
		},
		templateUrl: 'templates/misionCardDcv.html',
		link: function(scope, element, attrs) {

			scope.moreInformation = function(ev) {
				$state.go('main.missionDetail', { id: scope.mission._id });
			};
		}
	};
}]);