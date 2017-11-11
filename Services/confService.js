module.exports.confService = (message, callback) => {
    let {host, username, password} = message;
    host = host || 'app.getlarge.eu';
    username = username || 'user';
    password = password || 'password';

    console.log('message :', message);
}
