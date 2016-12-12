var request = require('./utils/request')(),
	express = require('express'),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

	bodyParser = require('body-parser');

module.exports = function(app, daemon){
	var router = express.Router();

	router.use(bodyParser.json());

	router.get('/', function (req, res) {

	});

	router.put('/', function (req, res) {

	});

	// una media api me informa que se encontro un nuevo mensaje para una keyword que me importa
	router.post('/keyword', function (req, res) {
		// type: 'twitter',
		// matches: [ 'lio' ],
		// text: 'RT @ActualFCB: "Para mi, Lionel Messi es el mejor jugador de la historia. No necesita un mundial para serlo." -Mario Kempes. https://t.co/h…',
		// username: 'Oswaldo_dl',
		// profileImage: http:XXXXX
		// userTwitterId: 99370651 }

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

		if (req.body.profilePicture != ''){
			req.body.image = req.body.profilePicture;
			daemon.addIncomingMessage(req.body);
			// toDataUrl(req.body.profilePicture, function(base64Img) {
			// 	req.body.image = base64Img;
			// 	daemon.addIncomingMessage(req.body);
			// });
		}else{
			daemon.addIncomingMessage(req.body);
		}


		res.send('OK');
	});

	router.delete('/', function (req, res) {

	});

	app.use('/', router);

	function handleError(err){
		throw err;
	}
};
