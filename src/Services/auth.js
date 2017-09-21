var RocketChat = require('rocketchat-nodejs').Client;

module.exports.auth = (message, callback) => {
  let {host, port, scheme, username, password} = message;
  port = port || 443;
  scheme = scheme || 'https';
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
  
  Client.login().then(() => {

    // write your API functions here
    // example
    Authentication.me().then(async result => {
    	callback(null, {
          var me = result;
          console.log(me);
        });
    })

    // /api/v1/chat.postMessage
    Chat.postMessage({ roomId: 'Cmhni6vpd3eCbstrA', text: "test de l'API rocketchat-nodejs" }).then(async result => {
    	callback(null, {
          var postMessage = result;
          console.log(postMessage);
        });
    })

    // /api/v1/logout
    Authentication.logout().then(async result => {
    	callback(null, {
         var info = result,
         console.log(info),
      }); 
    })

  })
  .catch(err => callback(err));
};
