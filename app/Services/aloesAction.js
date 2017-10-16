module.exports.aloesAction = (message, callback) => {

	let {action} = message;
  	action = action || 'ping';

	const AloesService = require('./aloesService');

	setTimeout( () => {

    	AloesService.send({'action': 'ping'});

	}, 3000);

};
