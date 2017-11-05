'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');

const engine = new Bpmn.Engine({
  source : fs.readFileSync('./examples/diagrams/DatabaseAlert.bpmn'),  
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

engine.execute({
  services : {
    dummy: (executionContext, serviceCallback) => {
      const result = executionContext['dummy'] || ['dummy'];

      serviceCallback(null, result);
    }
  },
  variables: {}
}, (err, instance) => {
  if (err) return console.log(err);
  instance.once('end', () => {
    console.log('instance process');
  });
});