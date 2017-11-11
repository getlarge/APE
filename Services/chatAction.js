const ChatClient = require('../app/ChatClient');

module.exports.chatAction = (message, callback) => {
  	let {action, body, roomId} = message;
  	action = action || 'Send';
  	body = body || '1,2,1,3!';
  	roomId = roomId || 'Cmhni6vpd3eCbstrA';

	switch(message.action) {

        case 'ListChannels':
            ChatClient.channelsList()
            .then((status) => {
              console.log('Rocketchat - Channels list', status);
              callback();
            }).catch(err => callback(err));
            break;
                    
        case 'Send':
            ChatClient.send(roomId, body)
            .then((status) => {
              console.log('Rocketchat - Message sent :', body, 'Status :', status);
              callback();
            }).catch(err => callback(err));
            break;

        case 'UserPresence':
            ChatClient.userPresence(userId)
            .then((status) => {
              console.log('Rocketchat -', userId, 'is here ?', status);
              callback();
            }).catch(err => callback(err));
            break;
    
    }

};