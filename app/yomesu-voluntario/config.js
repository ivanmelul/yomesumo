var config;

if (process.env.CONFIG === 'production') {
	config = {
		environment : {
			title: 'Yo me sumo VOLUNTARIOs',
			version: '1.0',
			port: 8006
		},
		// configuracion acesso base de datos
		connection: {
			host: '10.0.0.126',
			port: 8009,
			dbName: 'yomesu',
			retry:1000 // ms
		}
	};
} else {
	config = {
		environment : {
			title: 'Yo me sumo VOLUNTARIOs',
			version: '1.0',
			port: 8006
		},
		// configuracion acesso base de datos
		connection: {
			host: 'localhost',
			port: 8009,
			dbName: 'yomesu',
			retry:1000 // ms
		}
	};	
}

module.exports = config;
