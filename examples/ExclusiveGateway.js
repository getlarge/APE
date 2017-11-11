'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');

const engine = new Bpmn.Engine({
  name: 'exclusive gateway example',
  source: fs.readFileSync('./examples/diagrams/ExclusiveGateway.bpmn'),
});

engine.once('end', (definition) => {
  if (definition.getChildActivityById('end1').taken) throw new Error('<end1> was not supposed to be taken, check your input');
  console.log('TAKEN end2', definition.getChildActivityById('end2').taken);
});

engine.execute({
  variables: {
    input: 52
  }
});
