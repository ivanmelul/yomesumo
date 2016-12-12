var config;
if (process.env.CONFIG === 'production') {
	config = {
		name: 'fb',
		host: '10.0.0.113',
		port: 8002
	};
} else {
	config = {
		name: 'fb',
		host: 'localhost',
		port: 8002
	};
}
module.exports = config;
