var express 			= require('express');
var FB 					= require('fb'),
	searchEngine 		= require('./search-engine.js'),
	request 			= require('./utils/request')(),
	config 				= require('./config');
	//xmlhttprequest = require('xmlhttprequest');

module.exports = function(app){
	var router = express.Router();


	router.post('/keyword', function(req, res){
		var body = req.body || {};

		if (body.list && body.list.length > 0){
			for (var i = 0; i < body.list.length; i++) {
				searchEngine.add(body.list[i]);
			}
		}

		res.send();
	});

	router.delete('/keyword', function(req, res){
		var body = req.body || {};

		if (body.list && body.list.length > 0){
			for (keyword in body.list){
				searchEngine.remove(keyword);
			}
		}

		res.send();
	});

	router.get('/keyword', function(req, res){
		res.send(searchEngine.getAll());
	});


	router.get('/login', function (req, res) {
		//Mando la data necesaria para poder iniciar FB en el FE
		var data = {
			appId: config.facebook.loginAppId,
			permissions: config.facebook.permissions,
			version: config.facebook.version
		};

		res.send(data);
	});
	
	router.post('/user', function (req, res) {
		//Recibo los datos del usuario una vez que aceptó y me dio permisos para poder laburar sobre su FB
		// Esto es lo que recibo
		// {authResponse: { accessToken, expiresIn, signedRequest, userID }, status}
		var params = req.body;
		var userId = params.auth.userId,
			token = params.auth.accessToken,
			status = params.status;

		var fb = new FB.Facebook({
			appId: config.facebook.loginAppId,
			version: config.facebook.version,
			appSecret: config.facebook.loginAppSecret,
			accessToken: token
		});
		
		//TODO: Ver bien tamanio de la foto de perfil que queremos 
		fb.api('me', {fields: ['email', 'picture', 'first_name', 'last_name']}, function(result){
			
			if(!res || res.error) {
				res.status(400).send('Error al conectar con Facebook.');
		  	} else {
		  		
  				function toDataUrl(url, callback) {
					var xhr = new XMLHttpRequest();
					xhr.responseType = 'blob';
					xhr.onload = function() {
					var reader = new FileReader();
					reader.onloadend = function() {
					  callback(reader.result);
					}
					reader.readAsDataURL(xhr.response);
					};
					xhr.open('GET', url);
					xhr.send();
				}

				//genero un usuario de yomesumo
				var user = {
					name: result.first_name,
					lastname: result.last_name,
					mail: result.email,
					fb: {
						id: result.id,
						token: token
					}
				};

				res.send(user);

				//TODO: Encodear imagen

				// //encodeo la imagen y la seteo al usuario
				// toDataUrl(result.picture.data.url, function(base64Img) {
				// 	user.picture = base64Img;
				// 	res.send(user);
				// });
			} 
		});
	});



	//////////


	router.post('/addToMission', function(req, result){
		var body = req.body || {};


		//Pegar en un browser, si el exchange no funciona obtener uno en : 
		//https://graph.facebook.com/v2.6/oauth/access_token?grant_type=fb_exchange_token&client_id=1725592804395139&client_secret=23300b50e7638c04e9e071693c7bdeeb&fb_exchange_token=EAAYhauIiCIMBAHvhgSKR6BBhNl2oZA7qw0RFkBpgq34ciq4Rz9aAjaqY8Ros3xAFIAhCth1t4BOCkDzY2VcKY6ZCZCtZAfshjOlKSZCG02HexdTZARABrHZArDFOt0WvvmruCWUwpC0nxApItDjUVvxeGKK1mOEgqyLMgxZCkajU5AZDZD
		fb = new FB.Facebook({
			appId: config.facebook.appId,
			version: config.facebook.version,
			appSecret: config.facebook.appSecret,
			accessToken: config.facebook.long_access_token
		});


		fb.api(body.data.commentFacebookId + '/comments', 'post', { message: body.data.postText  }, function (res) {
		  if(!res || res.error) {
		  	result.status(400).send(res.error.message);
		  }else{
		  	result.send('OK.');
		  }
		});

	});


	app.use('/', router);
};
