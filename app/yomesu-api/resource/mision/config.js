var config;
if (process.env.CONFIG === 'production') {
	config = {
		name: 'mision',
		host: '10.0.0.126',
		port: 8004,
		mail: {
			host:'10.0.0.113',
			port: 8010
		}
	};
} else {
	config = {
		name: 'mision',
		host: 'localhost',
		port: 8004,
		mail: {
			host:'localhost',
			port: 8010
		}
	};
}

module.exports = config;
