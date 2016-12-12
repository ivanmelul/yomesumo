var config = require('./config'),
	Q = require('q'),
	things = require('./things.json');

module.exports = {
	get: function(body) {
		var deferrer = Q.defer();
		var dataToReturn;
		
		if (!body || !body.type){
			dataToReturn = things;
		} else {
			dataToReturn = things.filter(function(i) {
				return i.type === body.type;
			});
		}

		// TODO 1: completar esta lista con todas las cosas necesarias, hacerla gigante
		// TODO 2: mover esta lista a un documento en una base de datos
		deferrer.resolve(dataToReturn);

		return deferrer.promise;
	}



};