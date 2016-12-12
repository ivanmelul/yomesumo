var config = {
	environment : {
		title: 'Yo me sumo MISIONESs',
		version: '1.0',
		port: 8004
	},
	// configuracion acesso base de datos
	connection: {
		host: 'localhost',
		port: 8009,
		dbName: 'yomesu',
		retry:1000 // ms
	},

	maxDistance: 5 //en km
};

module.exports = config;
