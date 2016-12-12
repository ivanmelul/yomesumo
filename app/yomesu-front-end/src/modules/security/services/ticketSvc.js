angular.module('security').config(['$httpProvider', function($httpProvider) {
	// agrego interceptor para setear el ticket en cada request
	$httpProvider.interceptors.push(['sessionSvc', '$q', '$window', '$injector', '$log', function(sessionSvc, $q, $window, $injector, $log) {
		return  {
			'request': function request(config) {
				config.headers['x-session-token'] = sessionSvc.getToken();
				return config;
			},
			'responseError': function responseError(rejection) {
				var returnValue;
				var modalErrorSvc;
				var state;

				$log.error('REJECTION', rejection);

				switch(rejection.status){
					case -1:
						// nunca se pudo concretar el request
						modalErrorSvc = $injector.get("modalErrorSvc");
						modalErrorSvc({
							textContent: 'No se ha podido conectar con el servidor. Intentelo nuevamente más tarde',
							ok: 'Reintentar'
						}).then(function(){
							state = $injector.get("$state");
							state.reload();
						});
						returnValue = $q.resolve(rejection);
					break;
					case 400:
						// modalErrorSvc = $injector.get("modalErrorSvc");
						// modalErrorSvc({
						// 	textContent: 'Se realizo el request de manera incorrecta: ' + rejection.data
						// });
						console.log('Se realizo el request de manera incorrecta: ' + rejection.data);
						returnValue = $q.reject(rejection);
					break;
					case 401:
						// reseteo el token
						sessionSvc.clear();
						// si el backend dice que no tiene permiso, hago reset de la applicacion
						if ($window.location.hash !== '#/main/login') {
							$window.location.href = '/';
						}
						returnValue = $q.reject(rejection);
					break;
					case 500:
						// el enemigo
						modalErrorSvc = $injector.get("modalErrorSvc");
						modalErrorSvc({
							textContent: 'Ups! Hubo un error interno. Intentelo nuevamente más tarde'
						});
						returnValue = $q.reject(rejection);
					break;
					default:
						returnValue = $q.reject(rejection);
					break;
				}

				return returnValue;
			}
		};
	}]);
}]);