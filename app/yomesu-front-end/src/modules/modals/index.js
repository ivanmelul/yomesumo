var modals = angular.module('modals', []);


modals.config(['$mdThemingProvider', function($mdThemingProvider){
	$mdThemingProvider.theme('modalError') 
		.primaryPalette('red')
		.accentPalette('red')
		.warnPalette('red')
		.backgroundPalette('red');
}]);