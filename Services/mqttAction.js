//var AsyncClient = require("async-mqtt").AsyncClient;
 
var MQTTClient = require('../app/MQTTClient');

module.exports.mqttAction = (message, callback) => {

  //var asyncClient = new AsyncClient(MQTTClient);

  let {action, topic, payload, delay} = message;
    action = action || 'subscribe';
    topic = topic || 'logs';
    payload = payload || {'hello' : 'toto'};
    delay = delay || 1;

  switch(message.action) {

    case "publish":
    console.log()
      MQTTClient.publish(topic, payload, (message) => {
          console.log('CALLBACK')
      });
      break;

    case "subscribe":
      MQTTClient.subscribe(topic, (err, response) => {
          console.log(response);
          callback();
      });
      break;
 
    default:
      MQTTClient.publish(topic, payload, (message) => {
          console.log('CALLBACK', message)
      });
 
    }


};
