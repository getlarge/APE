const AloesApiClient = require('AloesApiClient');
const EventEmitter = require('events');
const conf = require('../config/config');

function isJson(str) {
    try { JSON.parse(str) }
    catch (e) { return false }
    return true;
}


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

        this.client.connect( () => {

            this.emit('connected');

            this.client.onmessage = message => {
                if (isJson(message)) {

                    message = JSON.parse(message);

                    switch (message.content) {

                        case 'pong':
                            console.log('Aloes - pong');
                            break;

                        case 'devicesList': // a modifier pour sélectionner les messages contenants le "case"...
                            console.log('Aloes - Devices list:', message);
                            break;

                        case 'sensorsList':
                            console.log('Aloes - Sensors list:', message);
                            break;

                        case 'userInfo':
                            console.log('Aloes - User info:', message);
                            break;

                        default:
                            console.log('Aloes - unknown message :', message);
                    };
                }
            };
        });
    }   


        send(message, callback) { // enrichir la callback pour récuper le message.content dans une variable body

            this.client.send(message, err => {

                if (err) {

                    console.log('send error:', err);

                }
            
                callback();
            });

        }

}


module.exports = new AloesService();