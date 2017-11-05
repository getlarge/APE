'use strict';

const fs = require('fs');
const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;

const engine = new Bpmn.Engine({
  name: 'service expression example',
  source: fs.readFileSync('./resources/serviceExample.bpmn'),
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

const listener = new EventEmitter();

engine.execute({
  services: {
    get: (context, next) => {
      console.log('RUN GET');
      next();
    },
    getService: (choice) => {
      console.log('RETURN', choice);
      return function(context, next) {
        console.log('RUN', choice);
      }
    },
    getWithIO: (reqOptions, next) => {
      console.log('RUN IO GET', reqOptions.uri, 'with headers', reqOptions.headers);
      next(null, {statusCode:200}, {});
    }

  },
  variables: {
    choice: 'Ehm...',
    api: 'http://example.com'
  },
  listener: listener,
   // console.log('Completed!');
});

engine.once('end', () => {
  console.log('Completed!');
});

      listener.on('leave', (task, execution) => {
         console.log(`${task.type}`);
      });

      listener.on('start', (task, execution) => {
         console.log(`${task.type}`);
         //console.log(`${task.type} <${execution.variables.taskInput.ServiceTask3}>`);
      });

