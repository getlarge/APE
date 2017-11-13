const mqtt = require('mqtt');
//const mqtt = require("async-mqtt");
const mqttPattern = require("mqtt-pattern");
const EventEmitter = require('events');
const conf = require('../config/config');

let client = mqtt.connect(conf.MQTTClient.url, conf.MQTTClient.options);

const outTopic = conf.MQTTClient.outTopic;
const inTopic = conf.MQTTClient.inTopic;

let params;

let mqttPatternExtract = function(topic) {
    var pattern = "APE/+module/+id/#data";
    params = MQTTPattern.extract(pattern, topic);
    console.log("Topic extrait : [ " + params[id].join(', ') + " ]");
    return params;
}

class MQTTClient extends EventEmitter {

    constructor() {
      super();
      client.on('connect', () => {
          this.emit('connected');
          console.log(`Connected to MQTT broker @ ${conf.MQTTClient.options.host}:${conf.MQTTClient.options.port}`);
          client.subscribe(outTopic);
      });

      client.on('message', (topic, message) => {
          this.emit('message_received');
          const obj = message.toString(); 
          console.log(obj);

          switch (message.content) {

              case 'deviceState':
                  console.log('deviceState')
                  break;

              default:
                  // console.log('unknown message :', message);
          };
      });
     
    }

    publish(topic, message, callback) {

        client.publish(topic, message, callback);
    }

    subscribe(topic, callback) {

        client.subscribe(topic, callback);
    }

//client.on(message, )
    receive(topic, callback) {

        client.subscribe(topic);
        console.log('MQTT receiver');

        client.on('message', (err, topic, message) => {
            
            if (err) return callback(err);

            mqttPatternExtract(topic);
            console.log('unknown MQTT message :', message.toString());
        
            switch (params.module) {

                case 'Activity':
                    console.log('Activity', message.toString())
                    break;
                
                case 'Engine':
                    console.log('Engine')
                    break;

                case 'Service':
                    console.log('Service', message.toString())
                    break;

                default:
                     console.log('unknown MQTT message :', message.toString());
            };

            this.emit('message_received');
            client.unsubscribe(topic);
            return callback(null, {
              data: message.toString(),
              rawData: message
            });

        });

    }
}

    //mqtt.publish(topic, message, {
    //    retain: true,
    //    qos: 0
    //});

module.exports = new MQTTClient();

