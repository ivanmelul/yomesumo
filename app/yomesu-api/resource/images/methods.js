var config = require('./config'),
	fs = require("fs"),
	Guid = require('guid');

module.exports = {

	generate: function(base64) {
		var extension = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';'));
		var base64Data = base64.replace(base64.substring(0, base64.indexOf(',') + 1), '');
		var guid = Guid.create();
		fs.writeFileSync(__dirname + config.imageFolder + '/' + guid.value + '.' + extension, base64Data, 'base64', function(err) {
			console.log(err);
			deferred.reject(err);
		});
		return '/' + config.name + '/' + guid.value + '.' + extension;
	}
};