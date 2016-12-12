angular.module('mision').service('misionSvc' ,['$http', 'appConfig', '$q', function  ($http, appConfig, $q)	{
	this.getById = function(id) {
		return $http.get(appConfig.backend + '/mision?_id=' + id).then(function missionGetById(resp) {
			var ngo;
			if (resp.data && resp.data.length > 0) {
				ngo = resp.data[0];
			}
			return ngo;
		}, function missionGetByIdError(resp) {
			// temporal
			console.log('ERROR:', resp);
		});
	};
	this.get = function() {
		return $http.get(appConfig.backend + '/mision').then(function missionGet(resp) {
			return resp.data;
		}, function missionGetError(resp) {
			// temporal
			console.log('ERROR:', resp);
		});
	};
	this.getMyMissions = function(voluntaryId) {
		return $http.get(appConfig.backend + '/mision/voluntary?_id=' + voluntaryId).then(function missionGet(resp) {
			return resp.data;
		}, function missionGetError(resp) {
			// temporal
			console.log('ERROR:', resp);
		});
	};
	
	this.getForHome = function() {
		return $http.get(appConfig.backend + '/mision/home').then(function missionGet(resp) {
			return resp.data;
		}, function missionGetError(resp) {
			// temporal
			console.log('ERROR:', resp);
		});
	};
	this.save = function(mision) {
		return $http.post(appConfig.backend + '/mision', mision).then(function missionSave(resp) {
			return resp.data;
		}, function missionSaveError(resp) {
			return $q.reject(resp);
		});
	};
	this.delete = function(mision) {
		return $http.delete(appConfig.backend + '/mision', { data: mision }).then(function missionSave(resp) {
			return resp.data;
		}, function missionSaveError(resp) {
			return $q.reject(resp);
		});
	};
	// Esta funcion es la que agrega un voluntario a una etapa o mision
	this.yoMeSumo = function(mission, stage, voluntary){
		var reqBody = {
			mission: mission ? mission._id : undefined,
			stage: stage ? stage._id : undefined,
			voluntary: {
				_id: voluntary._id,
				// mando a guardar uno de estos 3 valores
				username: voluntary.username || voluntary.name || voluntary.mail,
				mail: voluntary.mail
			}
		};

		return $http.post(appConfig.backend + '/mision/yoMeSumo', reqBody).then(function missionSave(resp) {
			return resp.data;
		}, function missionSaveError(resp) {
			return $q.reject(resp);
		});
	};
}]);