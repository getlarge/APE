const Bpmn = require('bpmn-engine');
const fs = require('fs');

const engine = new Bpmn.Engine({
  source: fs.readFileSync('./examples/diagrams/ServiceTask_2.bpmn'),
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

engine.execute({
  variables: {
    apiPath: 'https://cloud.getlarge.eu/ocs/v2.php/apps/serverinfo/api/v1/info'
  },
  services: {
    getRequest: {
      module: 'request',
      fnName: 'get'
    }
  }
}, (err, execution) => {
  if (err) throw err;
  execution.once('end', () => {
    console.log(execution.variables)
    console.log('Script task output:', execution.variables.result);
  });
});
