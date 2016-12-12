var yomesu = angular.module('yomesu', [
	// modulos desarrollados por 3ros
	'ui.router',
	'ngMaterial',
	'ngMap',
	'lfNgMdFileInput',
	'ngPassword',
    'duScroll',
	// si se crea un nuevo modulo agregar la dependencia en este array
	'appConfig',
	'about',
	'menu',
	'home',
	'facebook',
	'login',
	'security',
	'modals',
	'mision',
	'geolocation',
	'profile',
	'socialFeed',
	'ngo',
	'voluntary',
	'images',
	'map',
	'registro',
	'things',
	'twitter',
	'termsAndConditions',
	'privacyPolicy'
]);

yomesu.config(['$stateProvider', '$mdThemingProvider', '$httpProvider', function($stateProvider, $mdThemingProvider, $httpProvider){
	$stateProvider.state('main', {
		url: "/main",
		views: {
			menu: {
				templateUrl: "templates/menu.html"
			},
			content: {
				template: '<div ui-view="default"></div>'
			},
			footer: {
				templateUrl: 'templates/footer.html'
			}
		},
		resolve: {
			allHtmls: ['$q', '$http', 'appConfig', '$window', '$compile','$rootScope', function($q, $http, appConfig, $window, $compile, $rootScope){
				var deffered = $q.defer();
				
				$http.get(appConfig.frontend + '/templates/bundle.html').then(function(result) {
					angular.element($window.document.body).append($compile(result.data)($rootScope));
					deffered.resolve(result);
				}, function(){
					deffered.reject('ERROR al traer todos los htmls');
				});

				return deffered.promise;
			}]
		}
	});


// var customPrimary = {
//         '50': '#5a72a7',
//         '100': '#516696',
//         '200': '#485b86',
//         '300': '#3f5075',
//         '400': '#364465',
//         '500': '#2d3954',
//         '600': '#242e43',
//         '700': '#1b2233',
//         '800': '#121722',
//         '900': '#090c12',
//         'A100': '#6b80af',
//         'A200': '#7b8eb8',
//         'A400': '#8c9cc1',
//         'A700': '#010101'
//     };
//     $mdThemingProvider
//         .definePalette('customPrimary', 
//                         customPrimary);

//     var customAccent = {
//         '50': '#000000',
//         '100': '#000000',
//         '200': '#000000',
//         '300': '#030a09',
//         '400': '#091d1c',
//         '500': '#0f312f',
//         '600': '#1b5755',
//         '700': '#216b68',
//         '800': '#277e7b',
//         '900': '#2d928e',
//         'A100': '#1b5755',
//         'A200': '#154442',
//         'A400': '#0f312f',
//         'A700': '#33a5a1'
//     };
//     $mdThemingProvider
//         .definePalette('customAccent', 
//                         customAccent);

//     var customWarn = {
//         '50': '#ff2749',
//         '100': '#ff0e33',
//         '200': '#f30026',
//         '300': '#da0022',
//         '400': '#c0001e',
//         '500': '#A7001A',
//         '600': '#8d0016',
//         '700': '#740012',
//         '800': '#5a000e',
//         '900': '#41000a',
//         'A100': '#ff415f',
//         'A200': '#ff5a74',
//         'A400': '#ff748a',
//         'A700': '#270006'
//     };
//     $mdThemingProvider
//         .definePalette('customWarn', 
//                         customWarn);

//     var customBackground = {
//         '50': '#ffffff',
//         '100': '#ffffff',
//         '200': '#ffffff',
//         '300': '#ffffff',
//         '400': '#ffffff',
//         '500': '#ffffff',
//         '600': '#f2f2f2',
//         '700': '#e6e6e6',
//         '800': '#d9d9d9',
//         '900': '#cccccc',
//         'A100': '#ffffff',
//         'A200': '#ffffff',
//         'A400': '#ffffff',
//         'A700': '#bfbfbf'
//     };
//     $mdThemingProvider
//         .definePalette('customBackground', 
//                         customBackground);

//    $mdThemingProvider.theme('default')
//        .primaryPalette('customPrimary')
//        .accentPalette('customAccent')
//        .warnPalette('customWarn')
//        .backgroundPalette('customBackground');






	//con esto seteas las paletas por default
	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('orange')
		.warnPalette('red')
		.backgroundPalette('grey');

	// $mdThemingProvider.theme('secondaryTheme')
	// 	.primaryPalette('cyan')
	// 	.accentPalette('teal')
	// 	.warnPalette('red')
	// 	.backgroundPalette('lime');

	$httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
}]);

yomesu.run(['$state', '$rootScope', function($state, $rootScope){
	// cuando inicia la app direcciono a la home
	$rootScope.vm = {};
	$state.go('main.home');
}]);