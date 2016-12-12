var config = {
	environment : {
		title: 'Yo me sumo API REST',
		version: '1.0',
		port:8001
	},
	mode: process.env.CONFIG === 'production' ? 'production':'develop', // mode puede ser: 'develop' | 'production'
	ticketTimeLive: 15, // en minutos
	requestsTimeoutLimit: 10 // en segundos
};

module.exports = config;
