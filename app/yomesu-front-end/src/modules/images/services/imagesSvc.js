angular.module('images').factory('imagesSvc' ,['$q', '$window', function ($q, $window) {
	var api = {};

	// TODO que la funcion tenga como parametros la url, width y height. Con esto calcule el aspect radio y etc.
	api.getBase64FromImageUrl = function(url) {
		var deferrer = $q.defer();
		if (url && url.length > 0) {
			var img = new $window.Image();
			img.setAttribute('crossOrigin', 'anonymous');
			// TODO: agregar a esta funcion el caso de fallo
			img.onload = function () {
				// NOTA: esta función la tunié yo solito papa ;) (FEDE)
				var canvas = $window.document.createElement("canvas");
				// esto es para una imagen con el aspect ratio 16:9
				var aspectRadio = 16 / 9;
				var maxWidth = 700; // pivoteo sobre el width de la imagen
				var maxHeight = maxWidth / aspectRadio;
				var x; // punto de inicio para dibujar de x
				var y; // punto de inicio para dibujar de y
				var width; // ancho de la imagen a partir del punto de inicio
				var height; // alto de la imagen a partir del punto de inicio
				var scale; // para saber que tanto varia la imagen despues del ajuste de tamaño

				canvas.width = maxWidth;
				canvas.height = maxHeight;


				var ctx = canvas.getContext("2d");
				var imageAspectRatio = this.width / this.height;
				if (imageAspectRatio > aspectRadio) {
					//imagen más ancha que alta
					x = 0;
					width = maxWidth;

					scale = this.width / maxWidth;
					height = this.height / scale;
					y = (maxHeight - height) / 2;
				} else {
					// imagen más alta que ancha
					y = 0;
					height = maxHeight;
					scale = this.height / maxHeight;
					width = this.width / scale;
					x = (maxWidth - width) / 2;
				}

				ctx.drawImage(this,0,0,this.width,this.height,x,y,width,height);

				var dataURL = canvas.toDataURL("image/png");

				deferrer.resolve(dataURL);
			};

			img.src = url;
		} else {
			// no hay imagen, operación correcta, no hay que actualizar la imagen
			deferrer.resolve();
		}

		return deferrer.promise;
	};

	return api;
}]);