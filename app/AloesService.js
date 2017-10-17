const AloesApiClient = require('AloesApiClient');

function isJson(str) {
    try { JSON.parse(str) }
    catch (e) { return false }
    return true;
}

function AloesService() {

    client = new AloesApiClient({
        host: 'app.getlarge.eu',
        port: '443',
        username: 'user',
        password: 'password',
        secure: true,
        debug: true
    });

    client.connect( () => {

        client.onmessage = message => {

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

AloesService.prototype.send = message => {

    client.send(message, err => {

        if (err) {

            console.log('send error:', err);
        }
    });
}

module.exports = new AloesService();