var request 			= require('./utils/request')(),
	config 				= require('./config'),
	Q 					= require('q'),
	FB 					= require('fb'),
	searchEngine 		= require('./search-engine.js');


module.exports = function(){
	var daemon = {};
	var _shouldIContinue = true;
	var _keywords = {};
	var _respiroCount = 0;
	var _incomingMessages = [];
	var fb = {};
	var _yomesumo = 'yomesumo';
	var _readComments = {};

	daemon.init = function(ReadComments){
		_readComments = ReadComments;

		//Pegar en un browser, si el exchange no funciona obtener uno en : 
		//https://graph.facebook.com/v2.6/oauth/access_token?grant_type=fb_exchange_token&client_id=1725592804395139&client_secret=23300b50e7638c04e9e071693c7bdeeb&fb_exchange_token=EAAYhauIiCIMBAHvhgSKR6BBhNl2oZA7qw0RFkBpgq34ciq4Rz9aAjaqY8Ros3xAFIAhCth1t4BOCkDzY2VcKY6ZCZCtZAfshjOlKSZCG02HexdTZARABrHZArDFOt0WvvmruCWUwpC0nxApItDjUVvxeGKK1mOEgqyLMgxZCkajU5AZDZD
		fb = new FB.Facebook({
			appId: config.facebook.appId,
			version: config.facebook.version,
			appSecret: config.facebook.appSecret,
			accessToken: config.facebook.long_access_token
		});

		daemon.lifeCycle();
	};
	daemon.stop = function(){
		_shouldIContinue = false;
	};
	
	daemon.lifeCycle = function(){
		console.log('-------------------------------------------------------');
		console.log('Inicio del Respiro Nº ' + _respiroCount, new Date());

		request.get({
			host: config.ngo.host,
			port: config.ngo.port,
			path: '/'
		}).then(function(ongs) {

			for (var i = 0; i < ongs.length; i++) {
				var ong = ongs[i];

				if (ong.fbUrl != ''){

					fb.api(ong.fbUrl + '/feed', function(result){
						
						if(!result || result.error) {
							console.log(result.error.message);
					  	} else {
					  		
							var posts = result.data;

							for(var i=0; i<posts.length; i++){
								var post = posts[i];
								if (post.message && post.message.toLowerCase().indexOf(_yomesumo) != -1){

									fb.api(post.id + '/comments', function(result){
										
										if(!result || result.error) {
											console.log('Error al conectar con Facebook');
									  	} else {

/////////////////////////////////////////////
											var comments = result.data;
											for(var i=0; i<comments.length; i++) {
												var comment = comments[i];
												var message = comment.message.toLowerCase();
								
												//si es un post de interés, se lo mando a yomesu-alertas para que haga lo suyo
												var maches = searchEngine.match(message);
												if (maches.length){
													_readComments.find({'commentId': comment.id}, function(err, result){
														
														if (err) {return handleError(err);}
														else if (result.length == 0){
															var readComments = new _readComments({'commentId': comment.id});
															readComments.save(function (err, obj) {
																if (err) return handleError(err);
																console.log('MATCHEA y NO FUE PROCESADO, LO GUARDO COMO PROCESADO Y LO MANDO A YOMESU-ALERTAS', new Date(), message);
																request.post({
																	host: config.alertas.host,
																	port: config.alertas.port,
																	path: '/keyword'
																},{
																	type: 'facebook',
																	matches: maches,
																	text: message,
																	username: comment.from.name,
																	userFacebookId: comment.from.id,
																	profilePicture: '',
																	commentFacebookId: comment.id
																}).then(function(resp) {
																	console.log(resp);
																	resp.send(obj);
																}, function(err) {
																	console.log(err);
																});
															});
														} else {
															console.log('YA ESTÁ EN LA BD, NO HAGO NADA', message);
														}
													});
												} else {
													console.log('NO MATCHEA, NO HAGO NADA', message);
												}
											}
/////////////////////////////////////////////
									  		
										} 
									});
								}
							}	  		
						} 
					});

				}
			}

		}, function(err){
			console.log('ERROR: ', err);
		});



		if(_shouldIContinue) {
			_respiroCount++;
			setTimeout(daemon.lifeCycle, config.interLiveTime);
		}
	};


	// retorno el objecto frizado para que no se pueda modificar
	return Object.freeze(daemon);
}
