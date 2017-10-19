const AloesService = require('../AloesService');

module.exports.aloesAction = (message, callback) => {

	let {action, deviceId} = message;
  	action = action || 'ping';
  	deviceId = deviceId || '';

	switch(message.action) {

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

        case 'getScenarios':
            AloesService.Send('action :', action)
            .then((status) => {
              console.log('Aloes - Message sent :', action, 'Status :', status);
              callback();
            }).catch(err => callback(err));
            break;

        default:
			AloesService.send({'action': action}, () => {
    			callback();
    		});
    }


};
