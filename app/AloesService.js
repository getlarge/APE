const AloesApiClient = require('AloesApiClient');
const EventEmitter = require('events');

function isJson(str) {
    try { JSON.parse(str) }
    catch (e) { return false }
    return true;
}


class AloesService extends EventEmitter {
    constructor() {
        super();
        this.client = new AloesApiClient({
            host: 'app.getlarge.eu',
            port: '443',
            username: 'user',
            password: 'password',
            secure: true,
            debug: true
        });

        this.client.connect( () => {

            this.emit('connected');

            this.client.onmessage = message => {
                    if (isJson(message)) {

                        message = JSON.parse(message);

                        switch (message.content) {

                            case 'pong':
                                console.log('pong')
                                break;

                            case 'shownDevice':
                                console.log(message)
                                break;

                            default:
                                console.log('unknown message :', message);
                        };
                    }
                };
            });
        }   


        send(message, callback) {
            console.log('test');

            this.client.send(message, err => {

                if (err) {

                    console.log('send error:', err);

                }
            
                callback();
            });

        }
    }


module.exports = new AloesService();