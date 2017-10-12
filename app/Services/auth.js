const RocketChat = require('rocketchat-nodejs').Client;

module.exports.auth = (message, callback) => {
  let {host, port, scheme, username, password, body} = message;
  host = host || 'chat.aloes.io';
  port = port || 443;
  scheme = scheme || 'https';
  body = body || 'me voila!';
  console.log('AUTH REQUEST SEND');
	
  const Client = new RocketChat({
	  host: host,
    port: port,
    scheme: scheme,
    username: username,
    password: password
  });

  const Authentication = Client.Authentication();
  const Chat = Client.Chat();
  
  Client.login()
    .then(() => { 
      	console.log('AUTH REQUEST RECEIVED')

        Chat.postMessage({ roomId: 'Cmhni6vpd3eCbstrA', text: body })
        	.then(async result => {
        		callback(null, {
         		status: result.status,
         		postMessage: await result,
        		});
    		})

    	Authentication.logout()
    		.then(async result => {
    			console.log(result),
    			callback(null, await result);
    		}) 
		})
  	.catch(err => callback(err));
};
