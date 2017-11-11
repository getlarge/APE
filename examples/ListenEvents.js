'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;


const engine = new Bpmn.Engine({
  name: 'listen example',
  source: fs.readFileSync('./examples/diagrams/ListenEvents.bpmn'),
});
const listener = new EventEmitter();

listener.once('wait-userTask', (task) => {
  task.signal({
    sirname: 'von Rosen'
  });
});

listener.on('taken', (flow) => {
  console.log(`flow <${flow.id}> was taken`);
});

engine.once('end', (definition) => {
  console.log(`User sirname is ${definition.variables.inputFromUser.sirname}`);
});

engine.execute({
  listener: listener
}, (err, instance) => {
  if (err) throw err;
});


