var config = {

    AloesClient: {

        host: '',
        port: 443,
        secure: true,
        username : '',
        password: ''

    },

    ChatClient: {

        host: '',
        port: 443,
        scheme: 'https',
        username: '',
        password: ''

    },

    KrakenClient: {

        key: 'your-key',
        secret: 'your-blob',
        otp: ''

    },

    MQTTClient: {

        url: '',
        host: '',
        port: 1883,
        clientId: '',
        username: '',
        password: '',
        outTopic: '',
        inTopic: ''
    },

};

const merge = (obj1, obj2) => {

    for (var i in obj2) {

        if ( typeof obj2[i] === 'object' ) {

            obj1[i] = merge(obj1[i], obj2[i]);

        } else {

            obj1[i] = obj2[i];
        }
    }

    return obj1;
}

try {

    var devConfig = require('./config.dev.js');

} catch (e) {

    var devConfig = {};
}

module.exports = merge(config, devConfig);