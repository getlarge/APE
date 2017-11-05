'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const engine = new Bpmn.Engine({
  name: 'script task example',
  source: fs.readFileSync('./examples/diagrams/UserTask.bpmn'),
});

const listener = new EventEmitter();

listener.once('wait-userTask', (child, instance) => {
  instance.signal(child.activity.id, {
    sirname: 'von Rosen'
  });
});

engine.execute({
  listener: listener
}, (err, instance) => {
  if (err) throw err;

  instance.once('end', () => {
    console.log(`User sirname is ${instance.variables.taskInput.userTask.sirname}`);
  });
});
