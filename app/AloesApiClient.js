const request = require('request');
const WebSocket = require('ws');

const wsAttemptsMax = 10;
const debug = true;

class AloesApiClient {

    constructor() {

        this.ws = {};
    }

    init(url, login, password, secure, callback) {

        var nbHttp = 1;

        const makeHttpReq = (address, form) => {

            debug && console.log('sending http req', nbHttp)

            request.post({'url': 'http' + (secure ? 's' : '') + '://' + address + '/api/login', 'form': form}, (err, httpResponse, body) => {

                if (err) {

                    debug && console.log('error: ', err.code);

                    nbHttp++;

                    setTimeout(() => {

                        makeHttpReq(address, form);

                    }, 1000);

                } else {

                    debug && console.log('http req ok')

                    nbHttp = 1;

                    var nbWs = 1;

                    const makeWsReq = (address, cookie) => {

                        debug && console.log('opening ws', nbWs);

                        this.ws = new WebSocket('ws' + (secure ? 's' : '') + '://' + address, { 'headers': { 'Cookie': cookie }});

                        this.ws.onopen = () => {

                            debug && console.log('ws opened');

                            nbWs = 0;
                        };

                        this.ws.onmessage = message => {

                            callback(message);
                        };

                        this.ws.onerror = err => {

                            debug && console.log('error: ', err.code);
                        };

                        this.ws.onclose = () => {

                            debug && console.log('ws closed');

                            nbWs++;

                            setTimeout(() => {

                                (nbWs <= wsAttemptsMax) ? makeWsReq(address, cookie) : makeHttpReq(address, form);

                            }, 1000);
                        };
                    }

                    makeWsReq(address, httpResponse.headers['set-cookie'][0]);
                }
            });
        };

        makeHttpReq(url, {'login': login, 'password': password});   
    }

    send(message, error) {

        if (this.ws.readyState === 1) {

            this.ws.send( JSON.stringify( message ));

            error(null);

        } else {

            error('not connected')
        }
    }
}

module.exports = AloesApiClient;