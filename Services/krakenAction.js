module.exports.krakenAction = (message, callback) => {

	const KrakenClient = require('../app/KrakenClient');

	let {action, pair} = message;
    action = action || 'Time';
    pair = pair || ['XBTEUR'];

    switch(message.action) {

        case 'Assets':
             KrakenClient.getAssets(pair)
            .then((status) => {
                console.log('Kraken - Assets', status);
                callback();
            }).catch(err => callback(err));
            break;

        case 'Balance':
             krakenClient.getBalance()
            .then((status) => {
                console.log('Kraken - Balance', status);
                callback();
            }).catch(err => callback(err));
            break;

        case 'Time':
             krakenClient.getTime()
            .then((status) => {
                console.log('Kraken :- Time', status);
                callback();
            }).catch(err => callback(err));
            break;

        case 'Ticker':
             krakenClient.getTicker(pair)
            .then(result => {
                console.log('Kraken - Ticker', result);
                callback(null, {
                    status: result.status,
                    body: result,
                });

                //callback();
            }).catch(err => callback(err));
            break;
    
    }

}