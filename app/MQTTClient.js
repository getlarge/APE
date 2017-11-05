//const MQTT = require("async-mqtt");
const MQTT = require("mqtt");
const EventEmitter = require('events');
const conf = require('../config/config');
 
const mqttUrl = conf.MQTTClient.url;

const mqttOptions = {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  host: conf.MQTTClient.host,
  port: conf.MQTTClient.port,
//  username: conf.MQTTClient.username,
//  password: new Buffer(conf.MQTTClient.username),
//  ca: TRUSTED_CA_LIST
//  rejectUnauthorized: true
//  protocol: 'mqtts'
//  secureProtocol: 'TLSv1_method'
//  key: KEY
//  cert: CERT
//  ciphers: 'ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-RSA-RC4-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES128-SHA:AES256-SHA256:AES256-SHA:RC4-SHA:!aNULL:!eNULL:!LOW:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS:!EDH'
}; 
  
//const client = MQTT.connect("mqtt://192.168.1.84:1883");
//const client = MQTT.connect(mqttUrl, mqttOptions);

// WHen passing async functions as event listeners, make sure to have a try catch block 
//client.on("connect", doStuff);

class MQTTClient extends EventEmitter {

    constructor() {
        super();
        this.client = new MQTT.connect("mqtt://192.168.1.84:1883");
        this.client.on('connect', () => {
            this.emit('connected');
            this.client.subscribe('logs');
            this.client.publish('logs', 'Hello mqtt');
            //doStuff();
        });
 
        this.client.on('message', (topic, message) => {
            
            console.log(message.toString());
           
            switch (message.content) {

                default:
                    // console.log('unknown message :', message);
            };
        
        this.client.end();
        
        });
    }

    publish(topic, payload) {
        return new Promise((resolve, reject) => {
            this.client.publish(topic, payload)
            .then(result => {
              resolve({
                status: result.status,
                body: result,
              })
          }).catch((e) => {
            reject(e);
          });
        })
        //asyncClient.publish(topic, payload).then(function(){
        //    console.log("We async now");
        //    return asyncClient.end();
        //});
    }
}
module.exports = new MQTTClient();