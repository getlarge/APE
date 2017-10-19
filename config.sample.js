var config = {

    AloesService: {

        host: '',
        port: 443,
        secure: true,
        username : '',
        password: ''

    },

    ChatService: {

        host: '',
        port: 443,
        scheme: 'https',
        username: '',
        password: ''

    },

    KrakenService: {

        key: 'your-key',
        secret: 'your-blob',
        otp: ''

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