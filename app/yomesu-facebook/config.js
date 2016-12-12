var config;

if (process.env.CONFIG === 'production') {
	config = {
		// configuracion acesso base de datos
		connection: {
			host: '10.0.0.126',
			port: 8009,
			dbName: 'yomesu',
			retry:1000 // ms
		},
		environment: {
			title: 'Yo me sumo FACEBOOK',
			version: '1.0',
			host: 'localhost',
			port: 8002
		},
		ngo: {
			host:'10.0.0.126',
			port: 8005
		},
		alertas: {
			host:'localhost',
			port: 8007
		},
		interLiveTime: 30000, // tiempo entre cada respiro de la aplicacion
		
		//para Producción
		facebook: {
		    loginAppId: '1725153554439064',
		    appId: '1725592804395139',
		    loginAppSecret: '28b60294a33dac4a3c5c1520890cb7bd',
		    appSecret: '23300b50e7638c04e9e071693c7bdeeb',
		    redirectUri:'http://localhost:8002/login/callback',
		    version: 'v2.8',
		    permissions: 'user_about_me, email, ads_management',
		    //este long-live-token se obtiene desde : https://graph.facebook.com/v2.6/oauth/access_token?grant_type=fb_exchange_token&client_id=1725153554439064&client_secret=28b60294a33dac4a3c5c1520890cb7bd&fb_exchange_token=EAAYhBJzLm5gBAM8ZBc6wIZBnw9s7pb5bVVkWyLbKm2dl0Md8iisjsiCdKWh0lGL2OEiZC7mZAF8iZAMT4pui97r48Q9142f8Ixkv5f00SZBEPRrCX1sGl7sbXKI3LpHVNqLkKIkzA4mZAyBzaOPwgRB6htk5asz6CP8WCjYrU1ZBTwZDZD
		    //si no funciona cambiar el exchange token obteniéndolo en: https://developers.facebook.com/tools/explorer
		 //   	long_access_token: 'EAAYhBJzLm5gBAN86Ea3Bwmxx3YY6JqCl2WVEqC4auDWHUW1OPZBaQnqNt3LwcW6mQt2EZBPOj7te4kd5e4RCLyyLySk3kDzIiwEhmZBHkZCoN9nP3QLW712FmANg7YnxdAeFxd2fTgwI5edD81SmCM36nByo2CTvmLbrMg3shwZDZD',
			// yomesumo_long_access_token: 'EAAYhBJzLm5gBAOFue7MjwPZB3zwgzlLaHRKajwBQ9kSolXmC8D6jqRBrfA0xKuOnOcpLXr5RryuYPOjjnBVfC8PW99Nu6ucuLKwEIdwejhncZCoe2LyL8LJLpGDzpA4pKQ7ZAKRlooZBFbwyCUlpJIchvzHWTevEiWI5jC0LGQZDZD'
			long_access_token: 'EAAYhauIiCIMBAGKhCfL7dAytWmvlAkacZATzaY8P3U537XhgSrDVVzu8rIvGhq3nylL33fvdbaMzW3EIWK4F6kx6bj8ZBRxfMgqZBo1C03kNzNZAgUySYoys7AZCk1uxPZA3eBE25ZAgfUhCMd6r3EcqdZBNZCKKhcOMH3xEwxUAbIgZDZD'
		},
		requestsTimeoutLimit: 10
	};

} else {
	config = {
		// configuracion acesso base de datos
		connection: {
			host: 'localhost',
			port: 8009,
			dbName: 'yomesu',
			retry:1000 // ms
		},
		environment: {
			title: 'Yo me sumo FACEBOOK',
			version: '1.0',
			host: 'localhost',
			port: 8002
		},
		ngo: {
			host:'localhost',
			port: 8005
		},
		alertas: {
			host:'localhost',
			port: 8007
		},
		interLiveTime: 10000, // tiempo entre cada respiro de la aplicacion
		//para localhost
		facebook: {
		    loginAppId: '1725592804395139',
		    appId: '1725592804395139',
		    loginAppSecret: '23300b50e7638c04e9e071693c7bdeeb',
		    appSecret: '23300b50e7638c04e9e071693c7bdeeb',
		    redirectUri:'http://localhost:8000/login/callback',
		    version: 'v2.8',
		    permissions: 'user_about_me, email, ads_management',
		    //este long-live-token se obtiene desde : https://graph.facebook.com/v2.6/oauth/access_token?grant_type=fb_exchange_token&client_id=1725592804395139&client_secret=23300b50e7638c04e9e071693c7bdeeb&fb_exchange_token=EAAYhauIiCIMBAHvhgSKR6BBhNl2oZA7qw0RFkBpgq34ciq4Rz9aAjaqY8Ros3xAFIAhCth1t4BOCkDzY2VcKY6ZCZCtZAfshjOlKSZCG02HexdTZARABrHZArDFOt0WvvmruCWUwpC0nxApItDjUVvxeGKK1mOEgqyLMgxZCkajU5AZDZD
		    //si no funciona cambiar el exchange token obteniéndolo en: https://developers.facebook.com/tools/explorer
		   	long_access_token: 'EAAYhauIiCIMBAGKhCfL7dAytWmvlAkacZATzaY8P3U537XhgSrDVVzu8rIvGhq3nylL33fvdbaMzW3EIWK4F6kx6bj8ZBRxfMgqZBo1C03kNzNZAgUySYoys7AZCk1uxPZA3eBE25ZAgfUhCMd6r3EcqdZBNZCKKhcOMH3xEwxUAbIgZDZD'
		},
		requestsTimeoutLimit: 10
	};
}

module.exports = config;
