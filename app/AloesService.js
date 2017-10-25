const AloesApiClient = require('AloesApiClient');
const EventEmitter = require('events');
const conf = require('../config/config');

class AloesService extends EventEmitter {

    constructor() {
        super();
        this.client = new AloesApiClient({
            host: conf.AloesService.host,
            port: conf.AloesService.port,
            username: conf.AloesService.username,
            password: conf.AloesService.password,
            secure: conf.AloesService.secure,
            debug: true
        });

        this.client.connect();

        this.client.on('connected', () => {

            this.emit('connected');
        });

        this.client.on('message', message => {

            switch (message.content) {

                case 'deviceState':
                    console.log('deviceState')
                    break;

                case 'user':
                    console.log('user')
                    break;

                case 'points':
                    console.log('points')
                    break;

                default:
                    // console.log('unknown message :', message);
            };
        });
    }   

    send(message, callback) {

        this.client.send(message, callback);
    }
}


module.exports = new AloesService();