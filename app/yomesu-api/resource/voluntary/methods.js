var config = require('./config'),
	Q = require('q'),
	request = require('../../utils/request')(),
	tickets = require('../../utils/tickets');

module.exports = {

	get: function(path) {
		var deferred = Q.defer();

		var properties = {
			host: config.host,
			port: config.port,
			path: path
		};

		request.get(properties).then(function(resp){
			deferred.resolve(resp);
		}, function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	},
	update: function(voluntary){
		var properties = {
			host: config.host,
			port: config.port,
			path: '/',
			body: voluntary
		};
		return request.put(properties).then(function voluntaryUpdateSuccess(data){
			return data;
		});
	},

	post: function(voluntary){
		var deferred = Q.defer();

		var properties = {
			host: config.host,
			port: config.port,
			path: '/',
			body: voluntary
		};

		request.post(properties).then(function voluntaryCreateSuccess(data){
			deferred.resolve(data);
		}, function voluntaryCreateError(err){
			deferred.reject(err);
		}).catch(function voluntaryCreateCatch(err) {
			deferred.reject(err);
			throw err;
		});

		return deferred.promise;
	},

	getCurrent: function(tkc){
		if (tickets.isValidTicket(tkc))
			return tickets.getUser(tkc);

		return null;
	}
};