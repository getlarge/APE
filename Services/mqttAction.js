//var AsyncClient = require("async-mqtt").AsyncClient;
 
var mqttClient = require('../app/MQTTClient');
 
//var asyncClient = new AsyncClient(client);
 
module.exports.mqttAction = (message, callback) => {

	let {action, topic, payload} = message;
  	action = action || 'Subscribe';
  	topic = topic || 'logs';
  	payload = payload || 'APE_test';

	switch(message.action) {

		case 'Publish' :
			mqttClient.publish(topic, payload)
            .then((status) => {
    		  console.log("Message", payload, "sent to ", topic, "Status : ", status);
              callback();
            }).catch(err => callback(err));
    		callback();
			break;



        default:
 
    }


};
