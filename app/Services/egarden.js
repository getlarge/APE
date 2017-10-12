const AloesApiClient = require('../AloesApiClient');

module.exports.egarden = (message, callback) => {

	const client = new AloesApiClient();

	client.init('app.getlarge.eu', 'user', 'password', false, message => {

   	 console.log('incoming data:', message.data);
	});

	setTimeout( () => {

    	client.send({'action': 'ping'}, err => {

      		if (err) {

            	console.log('send error:', err);
        	}
    	});

	}, 5000);

};