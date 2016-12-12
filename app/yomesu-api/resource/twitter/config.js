var config;

if (process.env.CONFIG === 'production') {
	config = {
		name: 'twitter',
		host: '10.0.0.113',
		port: 8003,
		twitterFECallback: 'http://yomesumo.red/#/main/twitter/callback',
		loginScreenFE: 'http://yomesumo.red/#/main/login?na=1'
	};
} else {
	config = {
		name: 'twitter',
		host: 'localhost',
		port: 8003,
		twitterFECallback: 'http://localhost:8000/#/main/twitter/callback',
		loginScreenFE: 'http://localhost:8000/#/main/login?na=1'
	};
}
module.exports = config;
