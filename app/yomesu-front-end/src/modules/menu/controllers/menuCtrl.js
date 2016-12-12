angular.module('menu').controller('menuCtrl', ['$scope', '$state', 'voluntarySvc','sessionSvc', '$mdMedia', '$rootScope', 'loginSvc', '$window', '$location', function($scope, $state, voluntarySvc, sessionSvc, $mdMedia, $rootScope, loginSvc, $window, $location){
	$scope.vm = {};

	$scope.vm.userLogged = false;

	voluntarySvc.getCurrent().then(function loadCurrentVoluntary(voluntary){
		$scope.vm.voluntary = voluntary;
		$scope.vm.userLogged = true;
	});

	$scope.vm.goToHome = function() {
		$state.go('main.home');
	};
	$scope.vm.goToLogin = function() {
		$state.go('main.login');
	};
	$scope.vm.goToProfile = function(id) {
		$state.go('main.profile', {id: id});
	};
	$scope.vm.goToNgo = function(id) {
		$state.go('main.ngo', {id: id});
	};
	$scope.vm.goToNgoList = function(id) {
		$state.go('main.ngoList');
	};
	$scope.vm.goToMissionList = function(id) {
		$state.go('main.missionList');
	};
	$scope.vm.goToVoluntaryList = function(id) {
		$state.go('main.voluntaryList');
	};
	$scope.vm.gotoTermsAndConditions = function(id) {
		$state.go('main.termsAndConditions');
	};

	$scope.vmRoot = $rootScope.vm;
	$scope.$state = $state;
	
	$scope.logout = function() {
		delete $scope.vm.voluntary;
		$scope.vm.userLogged = false;
		loginSvc.logout(sessionSvc.getToken());
		sessionSvc.clear();
		$state.go('main.home');
	};
	$scope.$mdMedia = $mdMedia;
}]);