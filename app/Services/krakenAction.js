module.exports.krakenAction = (message, callback) => {

	const krakenService = require('../KrakenService');

	let {action, pair} = message;
    action = action || 'Time';
    pair = pair;

    switch(message.action) {

        case 'Assets':
             krakenService.getAssets(pair)
            .then((status) => {
                console.log('Kraken - Assets', status);
                callback();
            }).catch(err => callback(err));
            break;

        case 'Balance':
             krakenService.getBalance()
            .then((status) => {
                console.log('Kraken - Balance', status);
                callback();
            }).catch(err => callback(err));
            break;

        case 'Time':
             krakenService.getTime()
            .then((status) => {
                console.log('Kraken :- Time', status);
                callback();
            }).catch(err => callback(err));
            break;

        case 'Ticker':
             krakenService.getTicker(pair)
            .then((status) => {
                console.log('Kraken - Ticker', status);
                callback();
            }).catch(err => callback(err));
            break;
    
    }

}