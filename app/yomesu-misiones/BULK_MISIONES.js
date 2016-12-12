//mongoimport --db yomesu --collection misiones --type json --file seed.json --jsonArray
[
	{
		descripcion: 'String',
		ong: '12kmcvm3iif',
		fechaInicio: 123456789,
		etapas:[  // re veer la estructura de las etapas
			{
				name: String,
				descripcion: String,
				estado: Number //enum de estados, pendiente, en proceso, finalizado, cancelado
				fechaFin: Number,
				lugares:[{
					descripcion: String,
					lat: Number,
					lng: Number
				}],
				faltantes:[
					{
						descripcion: String,
						semaforo: Number
						cantidad: Number
					}
				]
			}
		]
	}
]