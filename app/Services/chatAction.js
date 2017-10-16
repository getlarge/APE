const chatService = require('./chatService');

module.exports.chatAction = (message, callback) => {
  let {body, roomId} = message;
  body = body || 'me voila!';
  roomId = roomId || 'Cmhni6vpd3eCbstrA';
  console.log('AUTH REQUEST SEND');

  chatService.send(body);
//  Notif.send(body).then(() => {
    console.log('AUTH REQUEST RECEIVED');

//  }).catch(err => callback(err));
};