var config = {};

if (process.env.CONFIG === 'production') {	
	config = {
			environment : {
			title: 'Yo me sumo ALERTASs',
			version: '1.0',
			port: 8007
		},
		interLiveTime: 10000, // tiempo entre cara respiro de la aplicacion
		mission: {
			host:'10.0.0.126',
			port: 8004
		},
		voluntary: {
			host:'10.0.0.126',
			port: 8006
		},
		ngo: {
			host:'10.0.0.126',
			port: 8005
		},
		twitter: {
			host:'10.0.0.113',
			port: 8003
		},
		mail: {
			host:'10.0.0.113',
			port: 8010
		},
		facebook: {
			host:'10.0.0.113',
			port: 8002
		},
		frontend: 'http://yomesumo.red',
		api: {
			host:'10.0.0.13',
			port: 8001
		},
		requestsTimeoutLimit: 10

	};
} else {
	config = {
			environment : {
			title: 'Yo me sumo ALERTASs',
			version: '1.0',
			port: 8007
		},
		interLiveTime: 10000, // tiempo entre cara respiro de la aplicacion
		mission: {
			host:'localhost',
			port: 8004
		},
		voluntary: {
			host:'localhost',
			port: 8006
		},
		ngo: {
			host:'localhost',
			port: 8005
		},
		twitter: {
			host:'localhost',
			port: 8003
		},
		mail: {
			host:'localhost',
			port: 8010
		},
		facebook: {
			host:'localhost',
			port: 8002
		},
		frontend: 'http://localhost:8000',
		api: {
			host:'localhost',
			port: 8001
		},
		requestsTimeoutLimit: 10
	};
}

module.exports = config;
