const Bpmn = require('bpmn-engine');
const fs = require('fs');

const engine = new Bpmn.Engine({
  name: 'service task example 3',
  source: fs.readFileSync('./examples/diagrams/ServiceTask_3.bpmn'),
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

engine.execute({
  services: {
    getService: () => {
      return (executionContext, callback) => {
        callback(null, executionContext.variables.input);
      };
    }
  },
  variables: {
    input: 1
  }
}, (err, instance) => {
  if (err) throw err;
});

engine.once('end', (definition) => {
  console.log(definition.variables.taskInput.serviceTask.output);
});
