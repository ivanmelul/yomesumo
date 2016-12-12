module.exports = {
	addToMission: function(body){
		var mail = {};
		var name = (body.data.voluntary.name == undefined) ? '' : ' ' + body.data.voluntary.name;
		mail.subject = 'Hola'+ name + ', ¡Yo me sumo! y '+ body.data.ong.name +' te envían información importante';
		
		var startDate = new Date(body.data.mission.startDate);
		var endDate = new Date(body.data.mission.endDate);
		if(startDate == endDate){
			body.duration = "el " + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear();
		}else{
			body.duration = "desde el " + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear() + " hasta el " + endDate.getDate() + "/" + endDate.getMonth() + "/" + endDate.getFullYear();
		}
		mail.body = body;
		return mail;
	},
	addToStage: function(body)
	{
		var mail = {};		
		var name = (body.data.voluntary.name == undefined) ? '' : ' ' + body.data.voluntary.name;
		mail.subject = 'Hola'+ name + ', ¡Yo me sumo! y '+ body.data.ong.name +' te envían información importante';
		
		var startDate = new Date(body.data.stage.startDate);
		var endDate = new Date(body.data.stage.endDate);
		if(startDate == endDate){
			body.duration = "el " + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear();
		}else{
			body.duration = "desde el " + startDate.getDate() + "/" + startDate.getMonth() + "/" + startDate.getFullYear() + " hasta el " + endDate.getDate() + "/" + endDate.getMonth() + "/" + endDate.getFullYear();
		}
		mail.body = body;
		return mail;
	},
	registerUser: function(body)
	{
		console.log("ENTRO A registerUser");
		var mail = {};		
		var name = (body.data.voluntary.name == undefined) ? '' : ' ' + body.data.voluntary.name;
		mail.subject = 'Hola'+ name + ', bienvenido a la red de voluntarios de ¡Yo me sumo!';
		mail.body = body;
		return mail;
	}
}