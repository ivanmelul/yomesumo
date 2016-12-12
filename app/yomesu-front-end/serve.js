var express = require('express');
var app = express();
var amount = 0;
// saco los parametros por default
var args = process.argv.slice(2);
// args[0] es el numero del puerto para correr la aplicación
var port = process.env.CONFIG === 'production'? 80 : 8000;
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});
app.use(function (req, res) {
	console.log(new Date(), '#' + amount + ' Sirviendo al FE file: ' + req.path + ' ip: ' + req.ip);
	res.sendFile(__dirname + '/build/' + req.path)
	amount++;
});

app.listen(port, function () {
  console.log('Front-end app listening on port ' + port + '!');
});