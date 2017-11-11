//var AsyncClient = require("async-mqtt").AsyncClient;
 
var MQTTClient = require('../app/MQTTClient');

module.exports.mqttAction = (message, callback) => {

  //var asyncClient = new AsyncClient(MQTTClient);

  let {action, topic, payload} = message;
    action = action || 'Subscribe';
    topic = topic || 'logs';
    payload = payload || 'APE_test';

  switch(message.action) {


     case 'Test' :

    default:
      MQTTClient.publish(topic, payload, (err, response) => {
                console.log(response);
                //const result = response;
                callback();
            });
 
    }


};
