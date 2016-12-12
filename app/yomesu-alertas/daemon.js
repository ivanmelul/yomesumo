var request = require('./utils/request')(),
	config = require('./config'),
	Q = require('q');

module.exports = function(){
	var daemon = {};
	var _shouldIContinue = true;
	var _keywords = {};
	var _respiroCount = 0;
	var _incomingMessages = [];
	daemon.init = function(){
		daemon.lifeCycle();
	};
	daemon.stop = function(){
		_shouldIContinue = false;
	};
	daemon.addIncomingMessage = function(data){
		console.log('Mensajes en cola: ', _incomingMessages.length + 1);
		_incomingMessages.push(data);
	};
	daemon.lifeCycle = function(){
		console.log('-------------------------------------------------------');
		console.log('Inicio del Respiro Nº ' + _respiroCount, new Date());
		
		processIncomingMessages();

		// traigo todos los hashtags de las misiones
		request.get({
			host: config.mission.host,
			port: config.mission.port,
			path: '/'
		}).then(function(missions) {
			var allHashTags = [];
			// limpio todas las keywords actuales
			unMarkAllKeywords(_keywords);

			// recolecto las keywords de todas las misiones
			for (var i = 0; i < missions.length; i++) {
				var mission = missions[i];
				var missionId = mission._id;
				// agrego los hastags de la mision
				[].push.apply(allHashTags, mission.hashTags);
				// agrego los hashtag con la información de la ong y la misión
				mission.hashTags.forEach(function(hashtag) {
					_keywords[hashtag] = _keywords[hashtag] || {missions:[], stages: []};
					_keywords[hashtag].missions = _keywords[hashtag].missions.concat(missionId);
				});
				for (var j = 0; j < mission.stages.length; j++) {
					var stage = mission.stages[j];
					var stageId = mission.stages[j]._id;
					// agrego los hastags de la etapa
					[].push.apply(allHashTags, stage.hashTags);
					// agrego los hashtag con la información de la ong y la etapa
					stage.hashTags.forEach(function(hashtag) {
						_keywords[hashtag] = _keywords[hashtag] || {missions:[], stages: []};
						_keywords[hashtag].stages = _keywords[hashtag].stages.concat(stageId);
					});
				}
			}

			// marco todas las keywords
			for (var j = 0; j < allHashTags.length; j++) {
				markKeword(_keywords[allHashTags[j]]);
			}

			sendToTwitter(allHashTags);
			sendToFacebook(allHashTags);
			// saco las keywords que no se usaron
			var removedKeywords = removeUnmark(_keywords);
			removeFromTwitter(removedKeywords);
			removeFromFacebook(removedKeywords);

		}, function(err){
			console.log('ERROR: ', err);
		});

		if(_shouldIContinue) {
			_respiroCount++;
			setTimeout(daemon.lifeCycle, config.interLiveTime);
		}
	};

	function sendToTwitter(hashTags){
		request.post({
			host: config.twitter.host,
			port: config.twitter.port,
			path: '/keyword',
			body: { list: hashTags }
		}).then(function(resp){
			// aca le mande todo al twitter
			console.log(resp);
		}, function(err){
			// error al mandar al twitter
			console.log(err);
		});
	}

	function removeFromTwitter(hashTags){
		request.delete({
			host: config.twitter.host,
			port: config.twitter.port,
			path: '/keyword',
			body: { list: hashTags }
		}).then(function(resp){
			// aca le mande todo al twitter
			console.log(resp);
		}, function(err){
			// error al mandar al twitter
			console.log(err);
		});
	}

	function sendToFacebook(hashTags){
		request.post({
			host: config.facebook.host,
			port: config.facebook.port,
			path: '/keyword',
			body: { list: hashTags }
		}).then(function(resp){
			// aca le mande todo al fb
			console.log(resp);
		}, function(err){
			// error al mandar al fb
			console.log(err);
		});
	}

	function removeFromFacebook(hashTags){
		request.delete({
			host: config.facebook.host,
			port: config.facebook.port,
			path: '/keyword',
			body: { list: hashTags }
		}).then(function(resp){
			// aca le mande todo al twitter
			console.log(resp);
		}, function(err){
			// error al mandar al twitter
			console.log(err);
		});
	}
	function unMarkAllKeywords(keywords){
		for (var i = 0; i < Object.keys(keywords).length; i++) {
			keywords[Object.keys(keywords)[i]].mark = false;
			keywords[Object.keys(keywords)[i]].missions.length = 0;
			keywords[Object.keys(keywords)[i]].stages.length = 0;
		}
	}
	function removeUnmark(keywords){
		var removedKeywords = [];
		for (var i = 0; i < Object.keys(keywords).length; i++) {
			if (!keywords[Object.keys(keywords)[i]].mark) {
				// agrego la descripcion de la keyword
				removedKeywords.push(Object.keys(keywords)[i]);
				delete keywords[Object.keys(keywords)[i]];
			}
		}
		return removedKeywords;
	}
	function markKeword(keyword){
		keyword.mark = true;
	}

	function processIncomingMessages() {
		for (var i = 0; i < _incomingMessages.length; i++) {
			processMessage(_incomingMessages[i]);
		}
		_incomingMessages.length = 0;

	}
	function processMessage(message) {
		switch(message.type) {
			case 'twitter':
				process(message);
			break;
			case 'facebook':
				process(message);
			break;
			default:
				console.log('Tipo de mensaje no definido: ' + message.type + '. Mensaje no procesado: ', message);
			break;
		}


	}

	function process(message) {
		var id = (message.type == 'twitter') ? 'userTwitterId' : 'userFacebookId';
		var path = (message.type == 'twitter') ? 'twitter' : 'fb';
		return request.get({
			host: config.voluntary.host,
			port: config.voluntary.port,
			path: '/?' + path + '.id=' + message[id]
		}).then(function(resp) {
			var deferrer = Q.defer();
			if (resp.length === 0) {
				// tengo que dar de alta al usuario
				createVoluntary(message).then(function(voluntary) {
					deferrer.resolve(voluntary);
				}, function(){
					deferrer.reject('Error al guardar el voluntario');
				});
			} else {
				// el voluntario ya existe
				deferrer.resolve(resp[0]);
			}
			deferrer.promise.then(function(voluntary){
				// busco las ongs interasas en la keyword para notificar
				for (var i = 0; i < message.matches.length; i++) {
					// si _keywords no tiene la keyword buscada, ignoro el mensaje recibido
					// eso se puede dar por una ventana de tiempo entre que se elimina una keyword de la base de datos y se notifica a yomesu-twitter
					if (!_keywords[message.matches[i]]) {
						continue;
					}
					var missions = _keywords[message.matches[i]].missions;
					for (var j = 0; j < missions.length; j++) {
						var missionId = missions[j];
						// traigo la mision para saber la ong a la que pertenece


						request.get({
							host: config.mission.host,
							port: config.mission.port,
							path: '/?_id=' + missionId
						}).then(function missionGetSuccess(missions) {
							// si no se encontraron resultados, retorno vacio
							if (missions.length === 0) {
								return
							}
							var mission = missions[0];
							// si la mision no tiene id de ong retorno vacio
							if (!mission.ong) {
								return
							}
							addMediaInMission(message, mission);
							// TODO aca add media (imagen del contenido) a la mision

							return request.get({
								host: config.ngo.host,
								port: config.ngo.port,
								path: '/?_id=' + mission.ong
							}).then(function ngoGetSuccess(ngo){
								// verifico que lo ong exista
								if (ngo.length === 0) {
									return
								}
								ngoNotify(voluntary, ngo[0], mission);
								voluntaryNotify(message, voluntary, ngo[0], mission)
								.then(function(resp){
									return ngo;
								}, function(err){
									return ngo;
								});
							}, function ngoGetError(err){
								console.log('Error al traer información de la ONG', err);
							}).catch(function ngoGetCatch(err) {
								console.log('Error: ', err);
							});

						}, function missionGetError(err){
							console.log('Error al traer información de la misión', err);
						}).catch(function missionGetCatch(err) {
							console.log('Error: ', err);
						});
					}
					// Hago lo mismo para las etapas de cada mision
					var stages = _keywords[message.matches[i]].stages;
					for (var j = 0; j < stages.length; j++) {
						var stagesId = stages[j];
						// traigo la mision para saber la ong a la que pertenece

						request.get({
							host: config.mission.host,
							port: config.mission.port,
							path: '/?stages[$elemMatch][_id]=' + stagesId
						}).then(function missionGetSuccess(missions) {
							// si no se encontraron resultados, retorno vacio
							if (missions.length === 0) {
								return
							}
							var mission = missions[0];
							var stage;
							for (var p = 0; p < mission.stages.length; p++) {
								if (mission.stages[p]._id === stagesId) {
									stage = mission.stages[p];
									break;
								}
							}
							// no se encontro la etapa buscada en esa mision, hay algo que huele mal
							if (!stage) {
								return;
							}
							// si la mision no tiene id de ong retorno vacio
							if (!mission.ong) {
								return
							}
							// TODO aca add media (imagen del contenido) a la etapa de la mision

							return request.get({
								host: config.ngo.host,
								port: config.ngo.port,
								path: '/?_id=' + mission.ong
							}).then(function ngoGetSuccess(ngo){
								// verifico que lo ong exista
								if (ngo.length === 0) {
									return
								}
								ngoNotify(voluntary, ngo[0], mission, stage);
								voluntaryNotify(message, voluntary, ngo[0], mission, stage)
								.then(function(resp){
									return ngo;
								}, function(err){
									return ngo;
								});
							}, function ngoGetError(err){
								console.log('Error al traer información de la ONG', err);
							}).catch(function ngoGetCatch(err) {
								console.log('Error: ', err);
							});

						}, function missionGetError(err){
							console.log('Error al traer información de la misión', err);
						}).catch(function missionGetCatch(err) {
							console.log('Error: ', err);
						});
					}
				}
			});
		}, function(err){
			// error al comunicarme con voluntarios
			console.log(err);
		}).catch(function(err){
			console.log('ERROR: ', err);
		});
	}

	function createVoluntary(message) {
		var id = (message.type == 'twitter') ? 'userTwitterId' : 'userFacebookId';

		var body = {
				username: message.username,
				image: message.image,
				// TODO: que hacer en este caso que no tengo información del mail?
				// Sin este parametro yomesu-voluntario no deja guardar
				mail:'no-mail' + Math.floor(Math.random() * 9999999999) + '@no-mail.com'
			}

		if (message.type == "twitter"){
			body.twitter = {
				id: message[id],
				username: message.username
			};
		}else{
			body.fb = {
				id: message[id],
				username: message.username
			};
		}



		return request.post({
			host: config.voluntary.host,
			port: config.voluntary.port,
			path: '/',
			body: body
		}).then(function voluntaryCreateSuccess(data){
			console.log('Voluntario creado de forma exitosa');
			
			console.log('ENVIANDO TUIT');

			request.post({
				host: config.twitter.host,
				port: config.twitter.port,
				path: '/status',
				body: {
					"type": "newVoluntary",
					"data":  voluntary
				}
			}).then(function(resp){
				console.log(resp);
			}, function(err){
				console.log(err);
			});
			
			return data;
		}, function voluntaryCreateError(err){
			console.log('Error al crear el voluntario', err);
		}).catch(function voluntaryCreateCatch(err) {
			console.log('Error: ', err);
		});
	}
	function ngoNotify(voluntary, ngo, mission, stage) {
		console.log('ENVIANDO MAIL NGO ');
		/*request.post({
			host: config.mail.host,
			port: config.mail.port,
			path: '/',
			body: {
				"type": "addToMission",
				"data": {
					"mission": {
						"_id": "57d0e54f298fbb115a7c7c8f",
						"name": "Juntar útiles",
						"description": "La idea es lograr que los chicos de la escuela N° 21 de Haedo tengan nuevos útiles antes de comenzar las clases. Se pueden llevar los útiles de 9 a 18hs en Jonte 2342 (y Nazca)",
						"startDate": "Sun May 30 18:47:06 +0000 2010",
						"endDate": "Mon May 31 18:47:06 +0000 2010",
						"image": ""
					},
					"voluntary": {
						"name" : "Juan",
						"mail" : "tomas.sl@hotmail.com"
					},
					"ong": {
						"name":"Haciendo Proezas",
						"description":"Somos una fundación que se encarga de generar un cambio a nivel educativo. Atacamos principalmente las problemáticas de las escuelas primarias con bajos recursos y situaciones de riesgo."
					}
				}
			}


		}).then(function(resp){
			console.log(resp);
		}, function(err){
			console.log(err);
		});*/

	}
	function voluntaryNotify(message, voluntary, ngo, mission, stage) {
		var deferrer = Q.defer();

		// TODO: enviar mail diciendo que se sumo
		console.log('ENVIAR MAIL o FB POST VOLUNTARY ');

		var body = {
			'mission': mission._id,
			'voluntary':voluntary
		};

		if (stage) body.stage = stage;

		request.post({
			host: config.api.host,
			port: config.api.port,
			path: '/mision/yoMeSumo',
			body: body
		}).then(function(resp){
			postSocials().then(function(resp){
				deferrer.resolve(resp);
			}, function(err){
				deferrer.reject(err);
			});
		}, function(err){
			postSocials().then(function(resp){
				deferrer.resolve(resp);
			}, function(err){
				deferrer.reject(err);
			});
		});

		var postSocials = function(){
			var deferrer = Q.defer();

			var postText = ngo.name + ' le da la bienvenida a la ';
			var startDate, endDate;

			if (stage){
				//addToStage
				postText += 'etapa "' + stage.name + '" de la misión ' + mission.name + '".\n';
				startDate = new Date(stage.startDate);
				endDate = new Date(stage.endDate);
			}else{
				//addToMission
				postText += 'misión "' + mission.name + '".\n';
				startDate = new Date(mission.startDate);
				endDate = new Date(mission.endDate);
			}


			if(startDate == endDate){
				postText+= "¿Cuándo? El " + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear();
			}else{
				postText+= "¿Cuándo? Desde el " + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear() + " hasta el " + endDate.getDate() + "/" + endDate.getMonth() + "/" + endDate.getFullYear();
			}

			var link = config.frontend +'/#/main/mission?id=' + mission._id;
			postText += ". " + link;

			if (message.type == 'twitter'){

				postText = 'Bienvenido a la misión "'+ mission.name +'". ' + link;

				console.log('ENVIANDO TUIT DICIENDO QUE SE SUMO');
				//por si viene nulo
				mission = mission || {};
				stage = stage || {};
				request.post({
					host: config.twitter.host,
					port: config.twitter.port,
					path: '/status',
					body: {
						"type": "addToMision",
						"data": {
							username: voluntary.username,
							postText: postText
						} 
					}
				}).then(function(resp){
					console.log(resp);
				}, function(err){
					console.log(err);
				});

			}else{

				console.log('ENVIANDO POST FB DICIENDO QUE SE SUMO');

				request.post({
					host: config.facebook.host,
					port: config.facebook.port,
					path: '/addToMission',
					body: {
						"type": "addToMission",
						"data": {
							"postText": postText,
							"commentFacebookId": message.commentFacebookId
						}
					}
				}).then(function(resp){
					console.log(resp);
					deferrer.resolve(resp);
				}, function(err){
					console.log(err);
					deferrer.reject(err);
				});
			}

			return deferrer.promise;
		}
		return deferrer.promise;
	}
	function addMediaInMission(message, mission) {
		mission.media.push({
			username: message.username,
			text: message.text,
			social: message.type,
			date: new Date()
		});
		return request.put({
			host: config.mission.host,
			port: config.mission.port,
			path: '/',
			body: mission
		}).then(function misionUpdateSuccess(data){
			console.log('Mision modificada de forma exitosa');
			return data;
		}, function misionUpdateError(err){
			console.log('Error al modificar la mision', err);
		}).catch(function misionUpdateCatch(err) {
			console.log('Error: ', err);
		});
	}


	// retorno el objecto frizado para que no se pueda modificar
	return Object.freeze(daemon);
}
