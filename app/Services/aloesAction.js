module.exports.aloesAction = (message, callback) => {

	let {action, deviceId} = message;
  	action = action || 'ping';
  	deviceId = deviceId || '';

	const AloesService = require('../AloesService');

	setTimeout( () => {
        
       	AloesService.send({'action': action, 'deviceId': deviceId});

	}, 3000);

};
