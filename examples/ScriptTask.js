'use strict';

const Bpmn = require('bpmn-engine');
const request = require('request');
const fs = require('fs');

const engine = new Bpmn.Engine({
  name: 'script task example',
  source: fs.readFileSync('./examples/diagrams/ScriptTasks.bpmn'),
});

engine.execute({
  variables: {
    scriptTaskCompleted: false
  },
  services: {
    request: {
      module: 'request'
    }
  }
}, (err, execution) => {
  if (err) throw err;

  execution.once('end', () => {
    console.log('Script task modification:', execution.variables.scriptTaskCompleted);
    console.log('Script task output:', execution.variables.taskInput.scriptTask.result);
  });
});

