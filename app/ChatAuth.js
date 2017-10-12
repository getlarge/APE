const RocketChat = require('rocketchat-nodejs').Client;

function chatAuth() {

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

chatAuth.prototype.send = (message, callback) => {

  let {body} = message;

  Chat.postMessage({ roomId: 'Cmhni6vpd3eCbstrA', text: body })
    .then(async result => {
      callback(null, {
      status: result.status,
      postMessage: await result,
      });
  });
}

module.exports = new chatAuth();