var express = require('express');
var fs 		= require('fs');
var mails 	= require('./mails');
var config 	= require('./config');
var sg 		= require('sendgrid').SendGrid(config.sendGridKey);




module.exports = function(app){
	var router = express.Router();
	router.use('/', function(req,res,next){
		if (isValid(req.body)){
			next();
		}
	});

	router.post('/', function (req, res) {
		console.log("entro a POST");
		var body = req.body;
		var mail = mails[req.body.type](body);


		console.log("despues de POST");
		console.log(mail);

		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');

		app.render(req.body.type, {body: mail.body, config: config}, function(err, html) {
			    
		  	var helper = require('sendgrid').mail
			from_email = new helper.Email(config.fromMail)
			to_email = new helper.Email(body.data.voluntary.mail)
			subject = mail.subject
			content = new helper.Content("text/html", html);
			mailToSend = new helper.Mail(from_email, subject, to_email, content)

			var requestBody = mailToSend.toJSON()
			var request = sg.emptyRequest()
			request.method = 'POST'
			request.path = '/v3/mail/send'
			request.body = requestBody
			sg.API(request, function (response) {
				res.send(response);
			})
		});




	});

	app.use('/', router);
};



function isValid(){
	//todo
	return true;
};