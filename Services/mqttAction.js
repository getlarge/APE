//var AsyncClient = require("async-mqtt").AsyncClient;
 
var MQTTClient = require('../app/MQTTClient');

module.exports.mqttAction = (message, callback) => {

  //var asyncClient = new AsyncClient(MQTTClient);

  let {action, topic, payload, delay} = message;
    action = action || 'subscribe';
    topic = topic || 'logs';
    payload = payload || 'APE_test';
    delay = delay || 1;

  switch(message.action) {

    case "publish":
      MQTTClient.publish(topic, payload, (err, response) => {
          console.log(response);
          //const result = response;
          callback();
      });
      break;

    case "receive":
        MQTTClient.receive(topic, (err, response) => {
            //clientsConnected++;
            //setTimeout(function(){                  
              if (err) return callback(err);
              MQTTClient.on('message_received', () => {
                  console.log('message received');
                  return callback();
                })
            //}, message.delay * 1000);
          //callback(null, true),
        });
      break;

    case "subscribe":
      MQTTClient.subscribe(topic, (err, response) => {
          console.log(response);
          callback();
      });
      break;
 
    default:
      MQTTClient.publish(topic, payload, (err, response) => {
          console.log(response);
          callback();
      });
 
    }


};
