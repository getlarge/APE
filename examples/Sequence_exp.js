'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

const engine = new Bpmn.Engine({
  name: 'sequence flow example',
  source: fs.readFileSync('./examples/diagrams/Sequence_flow.bpmn'),
});

const listener = new EventEmitter();
listener.on('taken-flow3withExpression', (flow) => {
  throw new Error(`<${flow.id}> should not have been taken`);
});

engine.execute({
  listener: listener,
  services: {
    isBelow: (input, test) => {
      return input < Number(test);
    }
  },
  variables: {
    input: 2
  }
}, (err) => {
  if (err) throw err;
});

engine.once('end', () => {
  console.log('WOHO!');
});
