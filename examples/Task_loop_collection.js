'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');

const engine = new Bpmn.Engine({
  source: fs.readFileSync('./examples/diagrams/Task_loop_collection.bpmn'),
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

engine.execute({
  services: {
    loop: (executionContext, callback) => {
      const prevResult = executionContext.variables.sum ? executionContext.variables.sum : 0;
      const result = prevResult + executionContext.item;
      callback(null, result);
    }
  },
  variables: {
    input: [1, 2, 3, 7]
  }
});

engine.once('end', (definition) => {
  console.log(definition.variables.sum, 'aught to be 13 blazing fast');
});
