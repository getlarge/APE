module.exports.chatService = (message, callback) => {
    let {host, username, password} = message;
    host = host || 'chat.aloes.io';
    username = username || 'rocket.cat';
    password = password || 'password';

    console.log('message :', message);
}
