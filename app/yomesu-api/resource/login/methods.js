var config = require('./config'),
	tickets = require('../../utils/tickets'),
	Q = require('q'),
	ongMethods = require('../ong/methods');
	request = require('../../utils/request')();

module.exports = {

	login: function(user) {
		var deferred = Q.defer();
		var properties = {
			host: config.host,
			port: config.port,
			path: '/login',
			body: {
				username: user.username,
				password: user.password,
				fbId: user.fbId,
				twId: user.twId
			}
		};
		
		request.post(properties).then(function(voluntario) {
			var ongsRequest = [];
			
			// obtengo la información de cada ONG en las cuales el voluntario desempeña un rol
			for (var i = 0; i < voluntario.ngos.length; i++) {
				// se puede mejorar agrupando los ids y hacer una sola llamada
				ongsRequest.push(ongMethods.getById(voluntario.ngos[i]._id));
			};
			Q.all(ongsRequest).then(function ngosRequestFinishAll(allResponse){
				// reemplazo el campo de ngos, pasa de tener solo el _id a toda la info de la ong
				voluntario.ngos = allResponse;
			}, function ngosRequestFinishAllError(errResponse){
				console.log(errResponse)
			}).finally(function(){
				// login correcto, genero  un ticket y lo relaciono con un voluntario
				var g = tickets.giveMeTicket(JSON.stringify(voluntario));
				deferred.resolve(g);
			});
			
		}, function(err) {
			deferred.reject(err);
		}).catch(function(err){
			console.log('ERROR: ',err);
			deferred.reject(err);
		});

		return deferred.promise;
	},
	logout: function(tkc){
		tickets.removeTicket(tkc);
	}
};