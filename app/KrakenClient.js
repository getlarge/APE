const Kraken = require('kraken-exchange');
//const kraken = require('kraken-exchange-api');
const EventEmitter = require('events');
const conf = require('../config/config');

class KrakenService extends EventEmitter {
  	constructor() {
    	super();
    	this.client = new Kraken(conf.KrakenClient.key, conf.KrakenClient.secret);
      this.emit('connected');
    }

/// comment récupérer les variables de resolve ?
	getTime() {
    	return new Promise((resolve, reject) => {
    		this.client.time()
        	.then(result => {
        		resolve({
            		status: result.status,
            		time: result,
          		})
          		//console.log('Kraken -', response);
      		}).catch((e) => {
        		reject(e);
      		});
    	})
    }

    getBalance() {
    	return new Promise((resolve, reject) => {
    		this.client.balance()
        	.then(result => {
        		resolve({
            		status: result.status,
            		balance: result,
          		})
              //console.log('Kraken -', response);
      		}).catch((e) => {
        		reject(e);
      		});
    	})
    }

    getAssets(pair) {
    	return new Promise((resolve, reject) => {
    		this.client.assets(pair)
        	.then(result => {
        		resolve({
            		status: result.status,
            		assets: result,
          		})
              //console.log('Kraken -', response);
      		}).catch((e) => {
        		reject(e);
      		});
    	})
    }

	getTicker(pair) {
		return new Promise((resolve, reject) => {
    		this.client.ticker(pair)
        	.then(result => {
        		resolve({
            		status: result.status,
            		ticker: result,
          		})
              //console.log('Kraken -', result);
      		}).catch((e) => {
        		reject(e);
      		});
    	})
    }

}

module.exports = new KrakenService();