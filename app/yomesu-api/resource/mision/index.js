var express = require('express'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	misionMethods = require('./methods'),
	ongMethod = require('../ong/methods'),
	Q = require('q'),
	geolocationMethod = require('../geolocation/methods'),
	imagesMethods = require('../images/methods'),
	globalConfig = require('../../config'),
	request = require('../../utils/request')();

module.exports = function(app){
	var router = express.Router();

	router.use('/', bodyParser.json({limit:'1mb'}));
	router.use(bodyParser.json());

	router.use('/', function(req, res, next) {
		// si el largo de la imagen es mayor a 10000 asumo que se trata de base64 y no un link
		if (req.body && req.body.image && req.body.image.length > 10000) {
			// sobre escribo la imagen base64 por la url de la imagen
			var imagePath = imagesMethods.generate(req.body.image);
			req.body.image = req.protocol + '://' + req.host + ':' + globalConfig.environment.port + imagePath
		}
		next();
	});

	// esta es la entrada que se utiliza para mostrar resultados sin tener en cuenta location ni user
	router.get('/', function (req, res, next) {
		misionMethods.get(req.url).then(function(mission) {
			var ongPromises = [];
			if (mission.length) {
				for (var i = 0; i < mission.length; i++) {
					ongPromises.push(ongMethod.get('/?_id=' + encodeURIComponent(mission[i].ong)));
				}
				Q.all(ongPromises).then(function(ongs) {
					for (var i = 0; i < mission.length; i++) {
						// esto sigifica que una misión puede tener una sola ONG
						if(ongs[i].length === 1){
							ongs[i] = ongs[i][0];
						}
						// elimino la imagen de la respuesta para que no pese tanto
						delete ongs[i].image;
						mission[i].ong = ongs[i];
					}
					res.json(mission);
				}, function(err){
					res.status(400).send(err);
				}).catch(function(err){
					res.status(500).send(err.message);
				});
			} else {
				res.json(mission);
			}
		}, function(err){
			res.status(401).send(err);
		}).catch(function(err){
			res.status(500).send(err.message);
		});
	});

	// esta es la entrada que se utiliza para mostrar resultados sin tener en cuenta location ni user
	router.get('/voluntary', function (req, res, next) {
		misionMethods.get(req.url).then(function(mission){
			var ongPromises = [];
			if (mission.length) {
				for (var i = 0; i < mission.length; i++) {
					ongPromises.push(ongMethod.get('/?_id=' + encodeURIComponent(mission[i].ong)));
				}
				Q.all(ongPromises).then(function(ongs) {
					for (var i = 0; i < mission.length; i++) {
						// esto sigifica que una misión puede tener una sola ONG
						if(ongs[i].length === 1){
							ongs[i] = ongs[i][0];
						}
						// elimino la imagen de la respuesta para que no pese tanto
						delete ongs[i].image;
						mission[i].ong = ongs[i];
					}
					res.json(mission);
				}, function(err){
					res.status(400).send(err);
				}).catch(function(err){
					res.status(500).send(err.message);
				});
			} else {
				res.json(mission);
			}
		}, function(err){
			res.status(401).send(err);
		}).catch(function(err){
			res.status(500).send(err.message);
		});
	});
	// esta es la entrada que se utiliza para mostrar resultados en la home, teniendo en cuenta user y location
	router.get('/home', function (req, res, next) {
		geolocationMethod.getLocation(req.ip).then(function(location) {
			var tkc = req.headers['x-session-token'];
			misionMethods.getForHome('/home/?', location, tkc).then(function(mission){
				var ongPromises = [];
				if (mission.length) {
					for (var i = 0; i < mission.length; i++) {
						ongPromises.push(ongMethod.get('/?_id=' + encodeURIComponent(mission[i].ong)));
					}
					Q.all(ongPromises).then(function(ongs) {
						for (var i = 0; i < mission.length; i++) {
							// esto sigifica que una misión puede tener una sola ONG
							if(ongs[i].length === 1){
								ongs[i] = ongs[i][0];
							}
							// elimino la imagen de la respuesta para que no pese tanto
							delete ongs[i].image;
							mission[i].ong = ongs[i];
						}
						res.json(mission);
					}, function(err){
						res.status(400).send(err);
					}).catch(function(err){
						res.status(500).send(err.message);
					});
				} else {
					res.json(mission);
				}
			}, function(err){
				res.status(401).send(err);
			}).catch(function(err){
				res.status(500).send(err.message);
			});
		}, function(err){
			res.status(401).send(err);
		}).catch(function(err){
			res.status(500).send(err.message);
		});
	});

	router.delete('/', function (req, res, next) {
		// TODO Agregar validacion de que sea un voluntario lider el que elimina la mision
		if(req.body._id) {
			misionMethods.delete(req.body).then(function(){
				//2XX
				res.send('Misión eliminada correctamente');
			},function(err){
				//4XX
				console.log(err);
				res.status(400).send('Error al eliminar la misión: ' + err.message);
			}).catch(function(){
				//5XX
				res.status(500).send('Error al eliminar la misión');
			})
		} else {
			res.status(400).send('Es necesario un id para eliminar la misión');
		}
	});

	router.post('/', function (req, res, next) {
		if(req.body._id) {
			
			misionMethods.get('/?_id=' +  req.body._id).then(function(missionArr){
				var mission = missionArr[0];
				// la unica forma de modificar los voluntarios es con /yoMeSumo
				req.body.voluntaries = mission.voluntaries;
				for (var i = 0; i < mission.stages.length; i++) {
					for (var j = 0; j < req.body.stages.length; j++) {
						if (req.body.stages[j]._id === mission.stages[i]._id) {
							req.body.stages[j].voluntaries = mission.stages[i].voluntaries;
						}
					}
					
				}

				misionMethods.update(req.body).then(function(resp) {
					if(resp.ok) {
						if (resp.nModified === 0) {
							res.status(200).send('Misión actualizada correctamente. Aunqué no se detectaron cambios');
						} else {
							res.status(200).send('Misión actualizada correctamente');
						}
					} else {
						res.status(400).send(resp);
					}
				});
			}, function(resp) {
				res.status(400).send('Error ', resp);
			}).catch(function(err) {
				res.status(500).send('Error ', err);
			});
		} else {
			misionMethods.insert(req.body).then(function(resp){
				res.status(200).send('Misión creada correctamente');
			}, function(err){
				res.status(400).send(err.message);
			});
		}
	});

	router.post('/yoMeSumo', function (req, res, next) {
		if(req.body.mission && req.body.voluntary) {
			// traigo informacion de la mision
			misionMethods.get('/?_id=' +  req.body.mission ).then(function(missionArr) {
				var mission = missionArr[0];
				var voluntaryExists = false;

				///////////////
				var bodyMail = {
					"data":{
							"mission": mission,
							"voluntary": req.body.voluntary
						}
				}
				///////////////

				if (req.body.stage) {

							////////
							bodyMail.type = "addToStage";
							bodyMail.data.stage = {};
							////////

					// el voluntario se anotó a una etapa de una misión
					for (var i = 0; i < mission.stages.length; i++) {
						if (mission.stages[i]._id === req.body.stage) {
							// el voluntario se anotó directamente en una misión
							for (var j = 0; j < mission.stages[i].voluntaries.length; j++) {
								if (mission.stages[i].voluntaries[j]._id === req.body.voluntary._id) {
									// el voluntario ya esta agregado
									voluntaryExists = true;
								}
							}
							if (!voluntaryExists) {
								// agrego al voluntario a la lista de gente que se sumo
								mission.stages[i].voluntaries.push({
									_id: req.body.voluntary._id,
									date: new Date(),
									username: req.body.voluntary.username
								});
							}


							////////
							bodyMail.data.stage = mission.stages[i];
							////////
					
							break;
						}
					}
				} else {
					// el voluntario se anotó directamente en una misión
					
					////////
					bodyMail.type = "addToMission";
					////////

					for (var i = 0; i < mission.voluntaries.length; i++) {
						if (mission.voluntaries[i]._id === req.body.voluntary._id) {
							// el voluntario ya esta agregado
							voluntaryExists = true;
						}
					}
					if (!voluntaryExists) {
						// agrego al voluntario a la lista de gente que se sumo
						mission.voluntaries.push({
							_id: req.body.voluntary._id,
							date: new Date(),
							username: req.body.voluntary.username
						});
					}
				}

				misionMethods.update(mission).then(function updateMission(resp){
					if( resp.nModified === 1 || resp.n === 1) {
						
						//Enviar mail a la ong y al voluntario informando que se sumaron
						
						////
						console.log('ENVIANDO MAIL ADD TO MISSION / STAGE for VOLUNTARY');
						
						//// TRAIGO datos de la ONG
						ongMethod.get('/?_id=' + encodeURIComponent(mission.ong)).then(function(ong){
							bodyMail.data.ong = ong[0];
							request.post({
								host: config.mail.host,
								port: config.mail.port,
								path: '/',
								body: bodyMail
							}).then(function(resp){
								res.send('Operación realizada de forma exitosa. Envió Mail correctamente');		
								}, function(err){
									res.status(err.status).send(err.message);
								});

						}, function(err) {
							res.status(400).send('Operación realizada de forma exitosa');
						}).catch(function(err){
							res.status(500).send(err);
						});

						/////
					} else {
						// si no hay registros modificados, asumo que el voluntario ya estaba en la mision
						res.send('Usted ya esta anotado a esta misión');
					}
				}, function updateMissionError(err) {
					res.status(400).send('Operación realizada de forma exitosa');
				}).catch(function (err){
					res.status(500).send(err);
				});
			});

		} else {
			res.status(400).send('Faltan datos para realizar la operacion');
		}
	});

	app.use('/' + config.name, router);
};