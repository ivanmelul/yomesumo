module.exports = function(inputParameters) {
	// inicializo variables
	var _parameters = {};
	var argv = inputParameters.slice(2);
	// inicializo los parametros
	for (var i = 0; i < argv.length; i = i + 2) {
		// el primer caracter tiene que ser un guion
		if (argv[i][0] !== '-'){
			throw 'Parametros no ingresados correctamente: ' + argv[0];
		};
		_parameters[argv[i]] = argv[i + 1];
	};
	return {
		get:function(key){
			var value = _parameters[key];
			return value;
		}
	};
};