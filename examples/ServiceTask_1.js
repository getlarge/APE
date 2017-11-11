'use strict';

const Bpmn = require('bpmn-engine');
const fs = require('fs');
const request = require('request');

const services = require('../tests/helpers/testHelpers');
services.getRequest = (message, callback) => {
  request.get(message.variables.apiPath, {json: true}, (err, resp, body) => {
    if (err) return callback(err);
    return callback(null, {
      statusCode: resp.statusCode,
      data: body
    });
  });
};

const engine = new Bpmn.Engine({
  name: 'service task example 1',
  source: fs.readFileSync('./examples/diagrams/ServiceTask_1.bpmn'),
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
      module: '../tests/helpers/testHelpers',
      fnName: 'getRequest'
    }
  }
}, (err, execution) => {
  if (err) throw err;

  execution.once('end', () => {
    console.log('Service task output:', execution.variables.taskInput.serviceTask);
  });
});
