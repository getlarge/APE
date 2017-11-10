'use strict';

const fs = require('fs');
const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;
//const listeners = require('../Events');
const services = require('../Services');
const aloesClient = require('./AloesClient');
//const chatClient = require('./ChatClient');
//const krakenClient = require('./KrakenClient');
const mqttClient = require('./MQTTClient');
var MQTTPattern = require("mqtt-pattern");

let stepsCounter = 0;
let clientsConnected = 0;
let servicesCounter = 2;
let id;
let type;
let event;
let filled;

//const source = fs.readFileSync('../resources/diagram_1.bpmn');


aloesClient.on('connected', () => {
  clientsConnected++;

  setTimeout(function(){
    init(clientsConnected);
  }, 1000);
});

//chatClient.on('connected', () => {
//  clientsConnected++;
//  init(clientsConnected);
//});

//krakenClient.on('connected', () => {
//  clientsConnected++;
//  init(clientsConnected);
//});

mqttClient.on('connected', () => {
  clientsConnected++;
  setTimeout(function(){
    init(clientsConnected);
  }, 1000);
});

const engine = new Bpmn.Engine({
  name: 'service expression example',
  source: fs.readFileSync('./resources/diagram_5.bpmn'),
//  source: source,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

let mqttPattern = function(pattern, task) {
    var params = {
      type: task.type,
    }
    //var filled = MQTTPattern.fill(pattern, params);
    //console.log(`Message filtré : [ ` + filled + " ]");
    return filled = MQTTPattern.fill(pattern, params);
}

const listener = new EventEmitter();
//// EVENT LISTENERS /////

//// START ////      
      listener.on('start', task => {

        mqttPattern("APE/activity/+type/start", task);

        if (stepsCounter == 0) {
          console.log('<!-- START APE -->');
          mqttClient.publish(filled, "<!-- START APE -->");
          engine.getDefinitions((err, definitions) => {
          if (err) throw err;
            console.log('Loaded', definitions[0].id);
            console.log('The definition comes with process', definitions[0].getProcesses()[0].id);
            //console.log('The definition comes with process', definitions[0].getProcesses()[0].id, definitions[0].getProcesses()[0].context.variables);
          });
        } 
        
        ++stepsCounter;
        console.log('STEP # :', stepsCounter, '| START', `${task.type} <${task.id}>`);
        //console.log('STEP # :', stepsCounter, '| START', task);

        mqttClient.publish(filled, JSON.stringify({id: task.id, name: task.name, input: task.getInput()}));
        //mqttClient.publish(filled, task.io.variables);
        console.log('task :', task.parentContext);

        switch(task.type) {

          case 'bpmn:Process':
            
            break;
          
          default :
           //console.log(`${task.type} <${execution.variables.taskInput.serviceTask}>`);

        }

      });

//// LEAVE ////
      listener.on('leave', task => {

        //mqttPattern("APE/activity/+type/leave", task);
        //mqttClient.publish(filled, JSON.stringify({id: task.id, name: task.name, input: task.getOutput()}));

        switch(task.type) {

          case 'bpmn:EndEvent':
            console.log('<!-- END APE -->');
            //this.saveState(engine, scriptID);
            engine.stop();
            process.exit(1);            
            break;

          default :
            //console.log(`${task.type} <${execution.variables.taskInput.task.name}>`);
           //console.log('leave', task.id);
        }

      });

//// END ////
      listener.on('end', (task) => {

        mqttPattern("APE/activity/+type/end", task);
        mqttClient.publish(filled, JSON.stringify({id: task.id, name: task.name, output: task.getOutput()}));

        //console.log('END', `${task.type} <${task.id}>`);
        switch(task.type) {
          
          case 'bpmn:ServiceTask':
            console.log('serviceTaskName', task.name, ' | serviceTaskOutput', task.getOutput());
            break;
          
          case 'bpmn:UserTask':
            console.log('userTaskName', task.name, ' | userTaskOutput', task.getOutput());
            break;
            
          default :
        }
      });

//// WAIT //// compose event name with "wait" and user task id, or just "wait" to listen for all waits
      listener.on('wait', (task) => {

        const {form, formKey, id, signal, type} = task;

        if (form) {
          console.log(`activity ${type} <${id}> setting form field`);
          form.getFields().forEach(({id, get, label}, idx) => {
            form.setFieldValue(id, `value${idx}`);
            console.log(`  ${label} <${id}> = ${get()}`);
            });
          return signal(form.getOutput())
        } else if (formKey) {
          console.log(`activity ${type} <${id}> expects form with key "${formKey}"`);
          return signal({ key: formKey });
        }

        console.log(`${type} <${id}> is waiting for signal`);

        switch (id) {
          
          case 'Task1' :
            return signal({name: 'kebab-case-draft'});
            break;
          
          case 'Task2' :
            return signal({finalName: 'camelCase'});
            break;

          case 'userTask' :
            console.log('yeah');
            return signal({accepted: 'YES'});
            break;

          default :
           // return signal();
        
        }

      });

      //listener.once('wait', (activity) => {
      //  console.log(`${activity.type} <${activity.id}>`);
      //  engine.signal(activity.id);
      //});

      //listener.on('wait-userTask', (task, instance) => {
      //  console.log(`${task.type} <${task.id}> of ${instance.id} is waiting for input`);
      //  task.signal('don´t wait for me');
      //});

//// TAKEN //// NOT Working with bpmn-engine#dev
      //listener.on('taken', (flow) => {
      //  console.log(`flow <${flow.id}> was taken`);
      //});

//// ERROR ////     
      listener.on('error', (err) => {
        console.log(`Error <${error}> occured`);
      });


let init = (clientsConnected) => {
  if(clientsConnected >= servicesCounter) {
    setTimeout(function(){
      engine.execute({
        services : services,
        variables: {
          input: 'jobi',
          choice: 'Ehm...',
          api: 'http://example.com'
        },
        listener : listener,
     // console.log('Completed!');
      }, (err, instance) => {
        if (err) throw err;
        console.log('Definition started with process', instance.mainProcess.id);
      });  
    }, 2000);
  }
};

engine.once('end', (definition) => {
  console.log(definition.variables);
  console.log('Completed!');
});

