var config;
if (process.env.CONFIG === 'production') {
	config = {
		name: 'login',
		host: '10.0.0.126',
		port: 8006
	};
} else {
	config = {
		name: 'login',
		host: 'localhost',
		port: 8006
	};
}
module.exports = config;
