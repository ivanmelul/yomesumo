var config;
if (process.env.CONFIG === 'production') {
	config = {
		name: 'ong',
		host: '10.0.0.126',
		port: 8005
	}
} else {
	config = {
		name: 'ong',
		host: 'localhost',
		port: 8005
	}
}

module.exports = config;
