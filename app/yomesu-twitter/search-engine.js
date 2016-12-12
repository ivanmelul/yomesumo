
var _keywords = [];

module.exports = {

	add: function(keyword) {
		// me fijo si la keyword ya esta agregada
		if(!~_keywords.indexOf(keyword)) {
			// si no esta agregada, la agrego
			_keywords.push(keyword);
		}
	},

	remove: function(keyword){
		// me fijo si existe
		if (~keywords.indexOf(keyword)) {
			// si existe, la saco
			_keywords.splice(_keywords.indexOf(keyword), 1);
		}
	},

	getAll: function(){
		return _keywords;
	},

	match: function(text) {
		var matches = [];

		for (var i=_keywords.length-1; i>=0; i--) {
			//si la palabra a buscar esta dentro del texto, devuelvo true.
			var reg = new RegExp(_keywords[i], "i");
		    if (text && text.search(reg) > -1) {
		        matches.push(_keywords[i]);
		    }
		}
		return matches;
	},

	getOriginalImageUrl: function(url){
		//la url de la imagen viene con un "_normal", hay que sacarlo para mandar la url de la imagen original
		var reg = new RegExp("_normal", "i");
	
	    return url.replace(reg, '');
	}
};