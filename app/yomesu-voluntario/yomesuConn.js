module.exports = function(mongoose, connectionConfig){
	// conectar a la base de datos
	var dbURI = 'mongodb://' + connectionConfig.host + ':' + connectionConfig.port + '/' + connectionConfig.dbName;

	var db = mongoose.connection;

	db.on('connecting', function() {
	console.log('connecting to MongoDB...');
	});

	db.on('error', function(error) {
		console.error('Error in MongoDb connection: ' + error);
		mongoose.disconnect();
	});
	db.on('connected', function() {
		console.log('MongoDB connected!');
	});
	db.once('open', function() {
		console.log('MongoDB connection opened!');
	});
	db.on('reconnected', function () {
		console.log('MongoDB reconnected!');
	});
	db.on('disconnected', function() {
		console.log('MongoDB disconnected!');
		// para no sobre cargar la red con re-intentos
		setTimeout(function(){
			mongoose.connect(dbURI, {server:{auto_reconnect:true}});
		}, connectionConfig.retry);
	});

	mongoose.connect(dbURI, {server:{auto_reconnect:true}});

};