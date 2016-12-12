var express = require('express'),
	config = require('./config'),
	mongoose = require('mongoose');

module.exports = function(app, Misiones){
	var router = express.Router();

	router.get('/', function (req, res) {
		Misiones.find(req.query, function(err, result){
			if (err) handleError(err);
			
			var feMissions = [];
			for (var i = 0; i < result.length; i++)
				feMissions.push(result[i].toObject());
			
			res.send(mapToFE(feMissions));
		});
	});

	router.get('/home', function (req, res) {
		var query = {
			$or: []
		};
		
		// query.$or.push({ $and:
		// 	[
		// 		{ "name" : "Mi ONG" }
		// 	]
		// });

		// query.$or.push({ $and:
		// 	[
		// 		{ "test" : "Test 1234 5" }
		// 	]
		// });

		var point = {
	        type: "Point",
	        coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
	    };
	    var geoOptions =  { spherical: true };

	    //ordeno por ubicación
		Misiones.geoNear(point, geoOptions, function(err, result){
			if (err) handleError(err);

			var feMissions = [];
			
			for (var i = 0; i < result.length; i++)
				feMissions.push(result[i].obj.toObject());

			//como al ordenar por ubicación ignora las que no tienen ubicación, las traigo aparte
			Misiones.find({ "stages.markers" : [] }, function(newErr, newResult){
				if (newErr) handleError(newErr);

				for (var i = 0; i < newResult.length; i++)
					feMissions.push(newResult[i].toObject());

				res.send(mapToFE(feMissions));
			})
		});
	});


	router.put('/', function (req, res) {
		var id = req.body._id;
		delete req.body._id;
		var mision = mapToDB(req.body);
		
		Misiones.update({ _id: id }, { $set: mision}, function(err, obj){
			if (err) res.status(401).send(err.error.message);	
			res.json(obj);
		});
	});

	router.post('/', function (req, res) {
		var mision = mapToDB(req.body);
		
		var misiones = new Misiones(mision);
		misiones.save(function (err, obj) {
			if (err) return handleError(err);
			res.json(obj);
		});
	});

	router.delete('/', function (req, res) {
		if (req.query._id) {
			Misiones.findByIdAndRemove(req.query._id, function (err, mision) {
				if (err) return handleError(err);
			    res.send('Mission eliminada correctamente');
			});
		} else {
			res.status(400).send('No se elimino ninguna mision');
		}
	});

	app.use('/', router);

	//TODO: Unificar la forma en la que ve el frontend y guarda la BD
	function mapToDB(mision){
		//cambio la forma de guardar position en la BD
		mision.stages.forEach(function (s, sIndex, sArray) {
			sArray[sIndex].markers.forEach(function(p, pIndex, pArray){
				var pos = {
					type: 'Point',
					coordinates: [p.position.lng, p.position.lat]
				}

				pArray[pIndex].position = pos;
			});
		});

		return mision;
	}

	function mapToFE(feMissions){
		//cambio la forma de mostrar la position en el FE
		feMissions.forEach(function (m, mIndex, mArray){
			mArray[mIndex].stages.forEach(function (s, sIndex, sArray) {
				sArray[sIndex].markers.forEach(function(p, pIndex, pArray){
					var pos = {
						lat: p.position.coordinates[1],
						lng: p.position.coordinates[0]
					}

					pArray[pIndex].position = pos;
				});
			});
		});

		return feMissions;
	}	

	function handleError(err){
		throw err;
	}
};
