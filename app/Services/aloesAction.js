const AloesService = require('../AloesService');

module.exports.aloesAction = (message, callback) => {

	console.log(message);

	let {action, deviceId} = message;
  	action = action || 'ping';
  	deviceId = deviceId || '';


    AloesService.send({'action': action, 'deviceId': deviceId});

};
