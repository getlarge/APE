const chatService = require('../ChatService');

module.exports.chatAction = (message, callback) => {
  let {body, roomId} = message;
  body = body || 'me voila!';
  roomId = roomId || 'Cmhni6vpd3eCbstrA';
  console.log('SEND CHAT REQUEST ');

//  chatService.send(body);
  chatService.send(body).then(() => {
    console.log('CHAT MESSAGE SENT');

  }).catch(err => callback(err));
};