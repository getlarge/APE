const mqtt = require('mqtt');
//const mqtt = require("async-mqtt");
const mqttPattern = require("mqtt-pattern");
const EventEmitter = require('events');
const conf = require('../config/config');

// block comment out the rest of this block if no tls
//ca_file = process.env.HUBOT_MQTT_CA_CERT;
// block comment out the rest of these varibles if no client_cert auth
//client_key_file  = process.env.HUBOT_MQTT_CLIENT_KEY
//client_cert_file = process.env.HUBOT_MQTT_CLIENT_CERT
//TRUSTED_CA_LIST  = fs.readFileSync(ca_file);
//KEY              = fs.readFileSync("#{client_key_file}")
//CERT             = fs.readFileSync("#{client_cert_file}")

const mqttOptions = {
//  protocolId: 'MQIsdp',
  protocolId: 'MQTT',
//  protocolVersion: 3,
  protocolVersion: 4,
  host: conf.MQTTClient.options.host,
  port: conf.MQTTClient.options.port,
//  clientId : conf.MQTTClient.clientId,
//  username : conf.MQTTClient.username,
//  password : conf.MQTTClient.password,
// block comment out the rest of thes if no tls
//  ca: TRUSTED_CA_LIST,
//  rejectUnauthorized: false,
// block comment out the rest of these if no client_cert auth
//  protocol: 'mqtts',
//  secureProtocol: 'TLSv1_method',
//  key: KEY,
//  cert: CERT,
//  ciphers: 'ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-RSA-RC4-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES128-SHA:AES256-SHA256:AES256-SHA:RC4-SHA:!aNULL:!eNULL:!LOW:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS:!EDH'
};

//let client = mqtt.connect(conf.MQTTClient.url, conf.MQTTClient.options);
let client = mqtt.connect(conf.MQTTClient.url, mqttOptions);


const outTopic = conf.MQTTClient.outTopic;
const inTopic = conf.MQTTClient.inTopic;

class MQTTClient extends EventEmitter {

    constructor() {
      super();
//      this.client = new mqtt.connect(conf.MQTTClient.url, conf.MQTTClient.options);
      client.on('connect', () => {
 //     this.client.on('connect', doStuff);
          this.emit('connected');
          console.log(`Connected to MQTT broker @ ${conf.MQTTClient.options.host}:${conf.MQTTClient.options.port}`);
          client.subscribe(outTopic);
      });
      client.on('message', (topic, message) => {

          const obj = JSON.parse(message.toString()); 
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


}


    //mqtt.publish(topic, message, {
    //    retain: true,
    //    qos: 0
    //});

module.exports = new MQTTClient();

