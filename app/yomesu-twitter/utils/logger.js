var _ = require('underscore');
module.exports = function(){
	var requestCount = 0;
	return {
		request: function(info) {
			var reqId = requestCount++;
			var requestInformation;

			if (info) {
				requestInformation = ' FROM: ' + '(req.ip) '+ ' TO: ' +  info.host + ':' + info.port + info.path + ' METHOD: ' + info.method
			} else {
				requestInformation = ' NO REQUEST INFORMATION';
			}
			// todo, hacer que logue en un archivo y con configuracion, para definir la granularidad
			console.log('REQUEST  - ID: ' + reqId + ' Time: ' + Date.now() + requestInformation);
			return reqId;
		},
		response: function(reqId, data) {
			// corto el texto máximo del response a 100 caracteres
			console.log('RESPONSE - ID: ' + reqId + ' VALUE: ', JSON.stringify(data).substring(0,99));
		},
		error: function(reqId, err) {
			console.log('ERROR - ID: ' + reqId + ' Time: ', Date.now(), err);
		}
	};
};
