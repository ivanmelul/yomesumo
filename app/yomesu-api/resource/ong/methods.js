var config = require('./config'),
	Q = require('q'),
	misionMethods = require('../mision/methods'),
	voluntaryMethods = require('../voluntary/methods'),
	request = require('../../utils/request')();

module.exports = {
	get: function(url) {
		var properties = {
			host: config.host,
			port: config.port,
			path: url
		};

		return request.get(properties);
	},
	getById: function(id) {
		var properties = {
			host: config.host,
			port: config.port,
			path: '/?_id=' + id
		};
		//TODO: Promises?
		return request.get(properties).then(function(arrOngs) {

			if (arrOngs.length === 1) {
				// busco entre todos los voluntarios quienes tienen esta ong como lider
				//var query = {ngos:{$in:[{"_id" : arrOngs[0]._id}]}};
				var path = '/?ngos=' + arrOngs[0]._id;
				return voluntaryMethods.get(path).then(function(leaderVoluntary){
					arrOngs[0].leaderVoluntary = leaderVoluntary;
					return arrOngs[0];
				});

			} else {
				throw new Error('Se intento buscar una ong por id pero la cantidad de resultados fue: ' + arrOngs.length);
			}
		}, function(err) {
			// errores 4XX
			// deferred.reject(err);
			throw err;
		}).catch(function(err) {
			// errores 5XX
			// deferred.reject(err);
			throw err;
		});
	},
	update: function(ngo) {
		var deferrer = Q.defer();
		var properties = {
			host: config.host,
			port: config.port,
			path: '/',
			body: ngo
		};
		request.put(properties).then(function ngoUpdateSuccess(data){
			// hasta aca, los datos correspondientes a la ong se actualizaron bien
			// TODO: si esto escala a miles de usuarios, borrar esto de aca y ponerlo en el perfil de cada usuario
			// ahora actualizo la información de los voluntarios lideres
			voluntaryMethods.get().then(function(voluntaries) {
				var voluntartyShouldUpdate;
				for (var j = 0; j < voluntaries.length; j++) {
					// busco si el voluntario tiene el id de la ong
					var idFouded = false;
					for (var k = 0; k < voluntaries[j].ngos.length; k++) {
						if (voluntaries[j].ngos[k]._id === ngo._id) {
							idFouded = true;
							break;
						}
					}
					// busco si la ong tiene el id del usuario
					var voluntaryHasAccess = false;
					for (var i = 0; i < ngo.leaderVoluntary.length; i++) {
						if (ngo.leaderVoluntary[i]._id === voluntaries[j]._id){
							voluntaryHasAccess = true;
							break;
						}
					}

					voluntartyShouldUpdate = false;
					if (idFouded) {
						if (voluntaryHasAccess) {
							// no hago nada porque ya lo tiene cargado
						} else {
							// lo saco de la lista de ongs
							voluntartyShouldUpdate = true;
							voluntaries[j].ngos.splice(voluntaries[j].ngos.indexOf(voluntaries[j].ngos[k]),1);
						}
					} else {
						if (voluntaryHasAccess) {
							// lo agrego a la lista de ongs
							voluntaries[j].ngos.push({
								_id: ngo._id,
								role: 'leader'
							});
							voluntartyShouldUpdate = true;
						} else {
							// no hago nada
						}
					}
					// TODO 1234: Siempre hago update. Esto es porque hay que traer la ong de la base de datos para comparar, no lo que le manda el FE como esta hecho ahora
					voluntartyShouldUpdate = true;
					if (voluntartyShouldUpdate) {
						// hago el save del volutnario
						voluntaryMethods.update(voluntaries[j]).then(function(){
							// todo ok, informar al FE?
						}, (function(){
							// TODO: informar al FE de esta situación
							console.log('ERROR al hacer update del voluntario ', JSON.stringify(this))
						}).bind(voluntaries[j]));
					}
				}

			});
			// por ahora no se informa si los update de los voluntarios se realizó de forma exitosa
			deferrer.resolve(data);
		});
		return deferrer.promise;
	},
};