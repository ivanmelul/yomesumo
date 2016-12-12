// TODO del modulo
// Conectar con Twitter
// Diseño
// Mensajería
// Hacer algo después del login de fb

angular.module('profile').controller('profileCtrl', ['$scope', '$location', 'profileSvc', 'imagesSvc', 'ngoSvc', 'thingsSvc', 'listModalSvc', 'modalSvc', '$rootScope', '$mdDialog', '$window', 'misionSvc', function($scope, $location, profileSvc, imagesSvc, ngoSvc, thingsSvc, listModalSvc, modalSvc, $rootScope, $mdDialog, $window, misionSvc){
	//saco el parametro del querystring
	var id = $location.search().id;

	//vm es el user con el mismo esqueleto que esta en la bd
	$scope.vm = {};

	// inicializo las variables para guardar la configuracion de las notificaciones
	$scope.vm.notifications = {};
	$scope.vm.notifications.ngos = [];
	$scope.vm.notifications.activities = [];
	$scope.vm.notifications.donations = [];
	$scope.vm.notifications.regions = [];

	//traigo el voluntario a mostrar (modificacion)
	$rootScope.loading = true;
	profileSvc.get(id).then(function getVoluntarySuccess(voluntary){
		$scope.vm = voluntary;

		//inicializo el objeto de fb en caso que no lo este, para pasarlo como parametro a la directiva
		if(!$scope.vm.fb){
			$scope.vm.fb = {};
		}
	}).finally(function(){
		$rootScope.loading = false;
	});

	misionSvc.getMyMissions(id).then(function(resp) {
		$scope.vm.myMissions = resp;
 	});

	//traigo todas las ongs para las preferencias
	ngoSvc.get().then(function getNgoSuccess(ngos){
		$scope.allNgo = ngos;
	});

	//traigo todos los tipos de actividades para las preferencias
	thingsSvc.get('activity').then(function getActivitiesSuccess(acts){
		$scope.allActivity = acts;
	});

	//traigo todos los tipos de donaciones para las preferencias
	thingsSvc.get('donation').then(function getDonationsSuccess(donations){
		$scope.allDonation = donations;
	});

	$scope.getNgoMatches = function(search){
		var upper = search.toUpperCase();
		return $scope.allNgo.filter(function ngoFilter(item){
			return ~item.name.toUpperCase().indexOf(upper);
		});
	};

	$scope.getActivityMatches = function(search){
		var upper = search.toUpperCase();
		return $scope.allActivity.filter(function activityFilter(item){
			return ~item.name.toUpperCase().indexOf(upper);
		});
	};

	$scope.getDonationMatches = function(search){
		var upper = search.toUpperCase();
		return $scope.allDonation.filter(function donationFilter(item){
			return ~item.name.toUpperCase().indexOf(upper);
		});
	};

	$scope.showAllNgos = function(){
		listModalSvc({ items: $scope.allNgo, title:'Todas las ONGs' }); 
	};

	$scope.showAllActivities = function(){
		listModalSvc({ items: $scope.allActivity, title:'Todas las actividades' }); 
	};

	$scope.showAllDonations = function(){
		listModalSvc({ items: $scope.allDonation, title:'Todas las donaciones' }); 
	};
	
	$scope.actualizar = function() {
		var url = ($scope.files01 && $scope.files01.length > 0) ? $scope.files01[0].lfDataUrl : '';
		$rootScope.loading = true;
		imagesSvc.getBase64FromImageUrl(url).then(function getBase64Success(base64Data){
			$scope.vm.image = base64Data;
			profileSvc.save($scope.vm).then(function saveProfileSuccess(resp){
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element($window.document.body))
					.clickOutsideToClose(true)
					.title('Voluntarios')
					.textContent('Guardado con exito')
					.ariaLabel('Guardado con exito')
					.ok('Aceptar')
				);
			}, function saveMisionError(err){
				// temporal
				console.log(err);
			}).finally(function(){
				$rootScope.loading = false;
			});
		}, function getBase64Error(err) {
			// temporal
			$rootScope.loading = false;
			console.error(err);
		});
	};
}]);