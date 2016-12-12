var home = angular.module('home', []);

home.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('main.footer', {
		url: "/footer",
		views: {
			footer:{
				templateUrl: "templates/footer.html",
				controller: 'footerCtrl.js'
			}
		}
	});
}]);