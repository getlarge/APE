const AloesService = require('../AloesService');

module.exports.aloesAction = (message, callback) => {

	let {action, deviceId} = message;
  	action = action || 'ping';
  	deviceId = deviceId || '';

	switch(message.action) {

        case 'read':
            AloesService.read({'action': action}, () => {
                callback();
            });
            break;


		case 'getDevices':
            AloesService.send({'action': action}, () => {
                callback();
            });
            break;

        case 'getSensors':
            AloesService.send({'action': action, 'deviceId': deviceId}, () => {
    			//console.log('message:', message);
    			callback();
    		});
            break;

        default:
			AloesService.send({'action': action}, () => {
    			callback();
    		});
    }


};
