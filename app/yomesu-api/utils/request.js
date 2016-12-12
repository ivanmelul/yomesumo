var http = require('http'),
	_ = require('underscore'),
	config = require('../config'),
	Q = require('q'),
	logger = require('../utils/logger')();

module.exports = function (){
	return {

		_defaultProperties: {
			headers: {
			    'Content-Type': 'application/json'
			},
			method: 'GET'
		},

		_request: function(prop){
			var reqId = logger.request(prop);
			var deferred = Q.defer();
			var extProp = _.extend(this._defaultProperties, prop);

			var req = http.request(
				extProp,
				function(respFromMS) {
					var acum = '';
					respFromMS.on('data', function(chunk){
						// esto es por si la información viene de a pedazos
						acum += chunk;
					});
					respFromMS.on('error', function(error){
						// aca algo salio mal
						logger.error(reqId, error);
						deferred.reject(error);
					});
					respFromMS.on('end', function(){
						logger.response(reqId, acum);

						if(this.headers['content-type'] && ~this.headers['content-type'].indexOf('application/json')) {
							acum = JSON.parse(acum);
						}
						//Si hay error, rejecteo
						if (respFromMS.statusCode && respFromMS.statusCode >= 200 && respFromMS.statusCode <=299){
							deferred.resolve(acum);
						} else {
							deferred.reject({ status: respFromMS.statusCode, message:acum });
						}
					});
				}
			);

			req.setTimeout(config.requestsTimeoutLimit * 1000, function(error){
				logger.error(reqId, 'Timeout error');
				deferred.reject('Timeout error');
			});

			req.on('error', function(error){
				logger.error(reqId, error);
				deferred.reject(error);
			});

			if (prop && prop.body) {
				req.write(JSON.stringify(prop.body));
			}
			req.end();
			return deferred.promise;
		},

		get: function(prop, body){
			prop.method = 'GET';
			prop.body = prop.body || body;
			return this._request(prop);
		},

		post: function(prop, body){
			prop.method = 'POST';
			prop.body = prop.body || body;
			return this._request(prop);
		},

		put: function(prop, body){
			prop.method = 'PUT';
			prop.body = prop.body || body;
			return this._request(prop);
		},

		delete: function(prop, body){
			prop.method = 'DELETE';
			prop.body = prop.body || body;
			return this._request(prop);
		}
	}
};