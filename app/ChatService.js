const RocketChat = require('rocketchat-nodejs').Client;
const EventEmitter = require('events');
const conf = require('../config/config');

const Client = new RocketChat({
  host: conf.ChatService.host,
  port: conf.ChatService.port,
  scheme: conf.ChatService.scheme,
  username: conf.ChatService.username,
  password: conf.ChatService.password
});

const Users = Client.Users();

class ChatService extends EventEmitter {
  constructor() {
    super();
    Client.login().then(() => {
      this.emit('connected');
    }).catch((error) => {
      console.log('Rocketchat -', error);
    });
  }

  channelsList() {
    return new Promise((resolve, reject) => {
      Channels.list()
        .then(result => {
          resolve({
            status: result.status,
            list: result,
          })
      }).catch((e) => {
        reject(e);
      });
    })
  }

  send(roomId, message) {
    return new Promise((resolve, reject) => {
      Client.Chat().postMessage({ roomId: roomId, text: message })
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

  userPresence(userId) {
    return new Promise((resolve, reject) => {
      Users.getPresence({ userId: userId })
        .then(result => {
          resolve({
            status: result.status,
            getPresence: result,
          })
      }).catch((e) => {
        reject(e);
      });
    })
  }

}

module.exports = new ChatService();