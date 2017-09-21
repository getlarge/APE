const RocketChat = require('rocketchat-nodejs').Client;

module.exports.auth = (message, callback) => {
  let {host, port, scheme, username, password, body} = message;
  host = host || 'chat.getlarge.eu';
  port = port || 443;
  scheme = scheme || 'https';
  body = body || 'me voila!';
  console.log('AUTH REQUEST SEND');
	var Client = new RocketChat({
	host: host,
    port: port,
    scheme: scheme,
    username: username,
    password: password
  });

  var Authentication = Client.Authentication();
  var Chat = Client.Chat();
  
  Client.login().then(async => {
     
    console.log('AUTH REQUEST RECEIVED')

    // write your API functions here
    // example
    Authentication.me().then((result) => {
          var me = result;
          console.log(me);
    })

    // /api/v1/chat.postMessage
    Chat.postMessage({ roomId: 'Cmhni6vpd3eCbstrA', text: body }).then((result) => {
          var postMessage = result;
    })

    // /api/v1/logout
    Authentication.logout().then((result) => {
         var info = result;
         console.log(info);
    }) 

    callback(null, {
    });

  })
  .catch(err => callback(err));
};
