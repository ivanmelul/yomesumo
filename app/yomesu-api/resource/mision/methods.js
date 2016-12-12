var config = require('./config'),
	Q = require('q'),
	request = require('../../utils/request')(),
	voluntaryMethods = require('../voluntary/methods');

module.exports = {

	get: function(path) {
		var properties = {
			host: config.host,
			port: config.port,
			path: path
		};

		return request.get(properties).then(function(resp) {
			return resp;
		}, function(err){
			return err;
		});

		return deferred.promise;
	},

	getForHome: function(path, location, tkc) {
		var user = voluntaryMethods.getCurrent(tkc);

		var properties = {
			host: config.host,
			port: config.port,
			path: path + 'lng=' + location.longitude + '&lat=' + location.latitude
		};

		return request.get(properties/*, user*/).then(function(resp) {
			return resp;
		}, function(err){
			return err;
		});

		return deferred.promise;
	},

	insert: function(mision) {
		var properties = {
			host: config.host,
			port: config.port,
			path: '/?'
		};
		return request.post(properties, mision).then(function(resp){
			return resp;
		}, function(err){
			return Q.reject(err.message);
		});

		return deferred.promise;
	},
	update: function(mision) {
		var properties = {
			host: config.host,
			port: config.port,
			path: '/?'
		};

		return request.put(properties, mision).then(function(resp){
			return resp;
		}, function(err){
			return Q.reject(err.message);
		});

		return deferred.promise;
	},

	delete: function(mision) {
		var properties = {
			host: config.host,
			port: config.port,
			path: '/?_id=' + mision._id
		};
		return request.delete(properties).then(function(resp){
			return resp;
		}, function(err){
			return Q.reject(err.message);
		});

		return deferred.promise;
	}
};