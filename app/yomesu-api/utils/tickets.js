var guid = require('guid'),
	config = require('../config')
// estructura donde se guardaran todos los tickets
var _tickets = {};
// tiempo de vida de un ticket en ms
var timelive = 1000 * 60 * config.ticketTimeLive

module.exports = {
	isValidTicket: function(guid) {
		var response;
		var ticketExpiryTime;

		if (_tickets[guid]) {
			ticketExpiryTime = _tickets[guid].timelive;

			if (ticketExpiryTime > (new Date()).getTime()) {
				// sigue valido
				response = true;
				// renuevo el tiempo de vida del ticket
				_tickets[guid].timelive = (new Date()).getTime() + timelive;
			} else {
				// venció
				delete _tickets[guid];
			}
		}
		return response;
	},
	giveMeTicket: function(user) {
		var newGuid = guid.create();
		_tickets[newGuid] = {
			user: JSON.parse(user),
			timelive: (new Date()).getTime() + timelive
		};

		return newGuid;
	},
	getUser: function(guid){
		return _tickets[guid].user
	},
	removeTicket: function(guid){
		delete _tickets[guid];
	}
	// todo agregar un proceso que borre los tickets expirados
};