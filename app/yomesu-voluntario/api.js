var express = require('express'),
	config = require('./config'),
	mongoose = require('mongoose');

module.exports = function(app, Voluntario){
	var router = express.Router();

	router.get('/', function (req, res) {
		if (req.query.ngos) {
			// para asegurarme que sea un array
			var aux = [].concat(req.query.ngos);
			var aux = aux.map(function formatNgoQuery(ngoId) {
				return { "_id":  mongoose.Types.ObjectId(ngoId) };
			});

			delete req.query.ngos;
			req.query['ngos._id'] = {
				$all: []
			};

			[].push.apply(req.query['ngos._id'].$all, aux);
		}
		Voluntario.find(req.query, function(err, result){
			res.send(result);
		});
	});

	router.use('/login', function(req, res, next){
		next();
	});

	router.post('/login', function (req, res) {
		var query = {
			$or: []
		};
	
		if (req.body.username && req.body.password) {
			// esta es la forma tradicional de hacer login
			query.$or.push({ $and: //Busqueda por credenciales de yomesumo
				[
					{ $or: [
						{ "username": req.body.username.toLowerCase() },
						{ "mail": req.body.username.toLowerCase() }
					]},
					{ "password": req.body.password }
				]
			});
		} else if (req.body.fbId) {
			// si tiene facebook id, lo busco por este campo
			query.$or.push({ $and: //Busqueda por credenciales de FB
				[
					{ "fb.id" :req.body.fbId }
				]
			});
		} else if (req.body.twId) {
			// si tiene twitter id, lo busco por este campo
			query.$or.push({ $and: //Busqueda por credenciales de Twitter
				[
					{ "twitter.id" :req.body.twId }
				]
			});
		}

		Voluntario.findOne(query, function(err, result){
			if(result) {
				Voluntario.update({ _id: result._id }, { $set: {
					lastLogin: (new Date()).getTime()
				}}, function(err, obj){
					if (err) return handleError(err);
				});
				res.send(result);
			} else {
				res.status(401).send('Login incorrecto');
			}
			res.end();
		});
	});

	router.put('/', function (req, res) {
		//TODO: Validar que no exista mail, fbid y esas cosas repetidas

		var id = req.body._id;
		delete req.body._id;
		Voluntario.update({ _id: id }, { $set: req.body}, function(err, obj){
			if (err) return handleError(err);
			res.send(obj);
		});
	});

	router.delete('/', function (req, res) {
		if (req.body._id){
			Voluntario.find({ _id:req.body._id }).remove(function(err, obj){
				if (err) return handleError(err);
				res.send(obj);
			});
		}
	});


	router.post('/', function (req, res) {
		//TODO: Validar que no exista mail, fbid y esas cosas repetidas
		if (req.body.mail){
			Voluntario.find({ mail: req.body.mail }, function(err, obj){
				if (err) return handleError(err);
				//Si no existe un voluntario con ese mail, lo creo

				if (obj.length === 0){ //TODO: pensar mejor manera
					var voluntario = new Voluntario(req.body);

					voluntario.save(function (err, obj) {
						if (err) return handleError(err);
						res.send(obj);
					});
				} else {
					res.status(400).send("El mail ingresado ya esta registrado.");
				}
			});
		} else {
			res.status(400).send("No se recibieron los parámetros correctos. Falta mail");
		}
	});

	function handleError(err){
		throw err;
	}

	app.use('/', router);
};