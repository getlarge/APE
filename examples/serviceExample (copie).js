'use strict';

const fs = require('fs');
const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;
//const listeners = require('../Events');
const services = require('../Services');
const aloesService = require('../app/AloesClient');
const chatService = require('../app/ChatClient');
const krakenService = require('../app/KrakenClient');

let stepsCounter = 0;
let servicesConnected = 0;

aloesService.on('connected', () => {
  servicesConnected++;

  setTimeout(function(){
    init(servicesConnected);
  }, 1000);
});

chatService.on('connected', () => {
  servicesConnected++;
  init(servicesConnected);
});

krakenService.on('connected', () => {
  servicesConnected++;
  init(servicesConnected);
});


const engine = new Bpmn.Engine({
  name: 'service expression example',
  source: fs.readFileSync('../resources/serviceExample.bpmn'),
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

const listener = new EventEmitter();
//// EVENT LISTENERS /////

//// START ////      
      listener.on('start', task => {
        
        if (stepsCounter == 0) {
          console.log('<!-- START APE -->');
          engine.getDefinitions((err, definitions) => {
          if (err) throw err;
            console.log('Loaded', definitions[0].id);
            console.log('The definition comes with process', definitions[0].getProcesses()[0].id);
          });
        } 
        
        ++stepsCounter;
        console.log('STEP # :', stepsCounter, '| START', `${task.type} <${task.id}>`);
        
        switch(task.type) {

          case 'bpmn:Process':
            
            break;

          case 'bpmn:ServiceTask':
            console.log('serviceTaskName', task.name, ' | serviceTaskInput', task.getInput());

            break;

          case 'bpmn:StartEvent':
            console.log('startEvent');
            break;
          
          case 'bpmn:UserTask':
            console.log('userTaskName', task.name, ' | userTaskInput', task.getInput());
            break;
          
          default :
            console.log(`${task.type} <${execution.variables.taskInput.serviceTask}>`);

        }

      });

//// LEAVE ////
      listener.on('leave', task => {

        switch(task.type) {

          case 'bpmn:EndEvent':
            console.log('<!-- END APE -->');
            //this.saveState(engine, scriptID);
            engine.stop();
            process.exit(1);            
            break;
          case 'bpmn:EndEvent':
            engine.getDefinitions((err, definitions) => {
              if (err) throw err;
                console.log('Loaded', definitions[0].id);
                //console.log('The definition comes with process', definitions[0].getProcesses()[0].id, definitions[0].getProcesses()[0].context.variables);
              });
            break;

          default :
            console.log(`${task.type} <${execution.variables.taskInput.serviceTask}>`);
           //console.log('leave', task.id);
        }

      });

//// END ////
      listener.on('end', (task) => {

        console.log('END', `${task.type} <${task.id}>`);
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

          case 'ServiceTask_PingAloes' :
            console.log('yeah');
            return signal({output: 'kebab-case-draft'});
            break;

          default :
            return signal();
        
        }

      });

      listener.once('wait', (activity) => {
        console.log(`${activity.type} <${activity.id}>`);
        engine.signal(activity.id);
      });

      //listener.on('wait-userTask', (task, instance) => {
      //  console.log(`${task.type} <${task.id}> of ${instance.id} is waiting for input`);
      //  task.signal('don´t wait for me');
      //});

//// TAKEN //// NOT Working with bpmn-engine#dev
      listener.on('taken', (flow) => {
        console.log(`flow <${flow.id}> was taken`);
      });

//// ERROR ////     
      listener.on('error', (err) => {
        console.log(`Error <${error}> occured`);
      });


let init = (servicesConnected) => {
  if(servicesConnected > 1) {
    engine.execute({
      listener : listener,
      services : services,
      variables: {
        choice: 'Ehm...',
        api: 'http://example.com'
      },
   // console.log('Completed!');
    });
  }
};

engine.once('end', () => {
  console.log('Completed!');
});

