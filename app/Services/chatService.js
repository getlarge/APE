const RocketChat = require('rocketchat-nodejs').Client;

module.exports.chatService = (message, callback) => {
    let {host, username, password} = message;
    host = host || 'chat.aloes.io';
    username = username || 'rocket.cat';
    password = password || 'password';

    console.log('message :', message);
}

function ChatService() {

  Client = new RocketChat({
    host: 'chat.aloes.io',
    port: 443,
    scheme: 'https',
    username: 'rocket.cat',
    password: 'Asplenium7'
  });

  Authentication = Client.Authentication();
  Chat = Client.Chat();

  Client.login()
}

ChatService.prototype.send = (message, callback) => {

  let {body} = message;

  Chat.postMessage({ roomId: 'Cmhni6vpd3eCbstrA', text: body })
    .then(async result => {
      callback(null, {
      status: result.status,
      postMessage: await result,
      });
  });
}

module.exports = new ChatService();