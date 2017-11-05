const AloesClient = require('../app/AloesClient');

module.exports.aloesAction = (message, callback) => {

	let {action, deviceId} = message;
  	action = action || 'ping';
  	deviceId = deviceId || '';

	switch(message.action) {

        default:
            AloesClient.send({'action': message.action}, (err, response) => {
                console.log(response);
                //const result = response;
                callback(null, {
                    status: 200,
                    result: response
                });
            });
    }


};
