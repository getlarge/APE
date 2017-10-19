const ChatService = require('../ChatService');

module.exports.chatAction = (message, callback) => {
  	let {action, body, roomId} = message;
  	action = action || 'Send';
  	body = body || '1,2,1,3!';
  	roomId = roomId || 'Cmhni6vpd3eCbstrA';

	switch(message.action) {

        case 'ListChannels':
            ChatService.channelsList()
            .then((status) => {
              console.log('Rocketchat - Channels list', status);
              callback();
            }).catch(err => callback(err));
            break;
                    
        case 'Send':
            ChatService.send(roomId, body)
            .then((status) => {
              console.log('Rocketchat - Message sent :', body, 'Status :', status);
              callback();
            }).catch(err => callback(err));
            break;

        case 'UserPresence':
            ChatService.userPresence(userId)
            .then((status) => {
              console.log('Rocketchat -', userId, 'is here ?', status);
              callback();
            }).catch(err => callback(err));
            break;
    
    }

};