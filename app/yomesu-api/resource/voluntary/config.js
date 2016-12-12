var config;

if (process.env.CONFIG === 'production') {
	config = {
		name: 'voluntary',
		host: '10.0.0.126',
		port: 8006,
		mail: {
			host:'localhost',
			port: 8010
		}
	};
} else {
	config = {
		name: 'voluntary',
		host: 'localhost',
		port: 8006,
		mail: {
			host:'localhost',
			port: 8010
		}
	};
}

module.exports = config;
