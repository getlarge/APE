const RocketChat = require('rocketchat-nodejs').Client;
const EventEmitter = require('events');
const Client = new RocketChat({
  host: 'chat.aloes.io',
  port: 443,
  scheme: 'https',
  username: 'rocket.cat',
  password: 'Asplenium7'
});

class ChatService extends EventEmitter {
  constructor() {
    super();
    Client.login().then(() => {
      this.emit('connected');
    }).catch((error) => {
      console.log(error);
    });
  }

  send(message) {
    return new Promise((resolve, reject) => {
      Client.Chat().postMessage({ roomId: 'Cmhni6vpd3eCbstrA', text: message })
        .then(result => {
          resolve({
            status: result.status,
            postMessage: result,
          })
      }).catch((e) => {
        reject(e);
      });
    })
  }
}

module.exports = new ChatService();