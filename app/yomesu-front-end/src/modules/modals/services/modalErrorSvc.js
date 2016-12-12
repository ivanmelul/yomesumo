angular.module('modals').factory('modalErrorSvc' ,['$mdDialog', '$q', function  ($mdDialog, $q) {
	var defaultConfig = {
		clickOutsideToClose:true,
		title: 'Error',
		textContent: 'Un error inesperado ha ocurrido',
		ok: 'Aceptar',
		theme: 'default'
	};

	return function displayErrorModal(config){
		config = angular.extend(defaultConfig, config);

		var modal = $mdDialog.alert()
	        .clickOutsideToClose(true)
	        .title(config.title)
	        .textContent(config.textContent)
	        .ok(config.ok)
	        .theme(config.theme);

        return $mdDialog.show(modal);
	};
}]);