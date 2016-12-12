var searchEngine = require('./search-engine.js'),
	request = require('./utils/request')(),
    config = require('./config');

var analyzeTweet = function(tweet){
	
	//si es un tuit de interés, se lo mando a yomesu-alertas para que haga lo suyo
	var maches = searchEngine.match(tweet.text);
	if (maches.length){
		console.log('MATCHEA, LO MANDO A YOMESU-ALERTAS', new Date(), tweet.text);
		request.post({
			host: config.alertas.host,
			port: config.alertas.port,
			path: '/keyword'
		},{
			type: 'twitter',
			matches: maches,
			text: tweet.text,
			username: tweet.user.screen_name,
			userTwitterId: tweet.user.id,
			profilePicture: searchEngine.getOriginalImageUrl(tweet.user.profile_image_url)
		}).then(function(resp) {
			console.log(resp);
		}, function(err) {
			console.log(err);
		});
	} else {
		console.log('NO MATCHEA, NO HAGO NADA', tweet.text);
	}
}

module.exports = function(app, twitter){

	function createConection(){
		if (config.twitter.enabled) {
			console.log('Iniciando la escucha en twitter de: ' + config.twitter.textToSearch);

			var stream = twitter.stream('statuses/filter', { track: config.twitter.textToSearch });

			stream.on('data', function(event) {
				analyzeTweet(event);
			});

			stream.on('end', function(end) {
				console.log('END', end);
			});
			
			stream.on('error', function(error) {
			  console.log('ERROR');
			  throw error;
			});
		} else {
			console.log('No se inicio la escucha en twitter porque esta deshabilitado');
		}
	}
	
	function resetConection(){
		setTimeout(function(){
			createConection();
		}, config.twitter.interConectionTime);
	}

	createConection();
};