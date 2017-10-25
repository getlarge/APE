'use strict';

const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;

const processXml = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  <process id="theProcess" isExecutable="true">
    <serviceTask id="serviceTask1" name="Get" camunda:expression="\${services.get}" />
    <serviceTask id="serviceTask2" name="Get with var" camunda:expression="\${services.getService(variables.choice)}" />
    <serviceTask id="serviceTask3" name="Call api" camunda:expression="\${services.getWithIO}">
      <extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="uri">\${variables.api}/v1/data</camunda:inputParameter>
          <camunda:inputParameter name="json">\${true}</camunda:inputParameter>
          <camunda:inputParameter name="headers">
            <camunda:map>
              <camunda:entry key="User-Agent">curl</camunda:entry>
              <camunda:entry key="Accept">application/json</camunda:entry>
            </camunda:map>
          </camunda:inputParameter>
          <camunda:outputParameter name="statusCode">\${result[0].statusCode}</camunda:outputParameter>
          <camunda:outputParameter name="body">\${result[1]}</camunda:outputParameter>
        </camunda:inputOutput>
      </extensionElements>
    </serviceTask>
  </process>
</definitions>`;

const engine = new Bpmn.Engine({
  name: 'service expression example',
  source: processXml,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});
const listener = new EventEmitter();

engine.execute({
  services: {
    get: (context, next) => {
      console.log('RUN GET');
      next();
    },
    getService: (choice) => {
      console.log('RETURN', choice);
      return function(context, next) {
        console.log('RUN', choice);
      }
    },
    getWithIO: (reqOptions, next) => {
      console.log('RUN IO GET', reqOptions.uri, 'with headers', reqOptions.headers);
      next(null, {statusCode:200}, {});
    }

  },
  variables: {
    choice: 'Ehm...',
    api: 'http://example.com'
  }

    console.log('Completed!');
});

engine.once('end', () => {
  console.log('Completed!');
});

      listener.on('leave', (task) => {
         console.log(`${task.type} <${execution.variables.taskInput.serviceTask}>`);
      });

