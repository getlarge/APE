const Bpmn = require('bpmn-engine');

const processXml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <process id="Process_1" isExecutable="true">
      <startEvent id="start">
        <outgoing>flow1</outgoing>
      </startEvent>
      <sequenceFlow id="flow1" sourceRef="start" targetRef="serviceTask" />
      <endEvent id="end">
        <incoming>flow2</incoming>
      </endEvent>
      <sequenceFlow id="flow2" sourceRef="serviceTask" targetRef="end" />
      <serviceTask id="serviceTask" name="Get">
        <extensionElements>
          <camunda:inputOutput>
            <camunda:inputParameter name="uri">
              <camunda:script scriptFormat="JavaScript">variables.apiPath</camunda:script>
            </camunda:inputParameter>
            <camunda:outputParameter name="result">
              <camunda:script scriptFormat="JavaScript"><![CDATA[
'use strict';
var result = {
  statusCode: result[0].statusCode,
  body: result[0].statusCode === 200 ? JSON.parse(result[1]) : undefined
};
result;
              ]]>
              </camunda:script>
            </camunda:outputParameter>
          </camunda:inputOutput>
          <camunda:properties>
            <camunda:property name="service" value="getRequest" />
          </camunda:properties>
        </extensionElements>
        <incoming>flow1</incoming>
        <outgoing>flow2</outgoing>
      </serviceTask>
    </process>
  `;

const engine = new Bpmn.Engine({
  source: processXml,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

engine.execute({
  variables: {
    apiPath: 'http://example.com/test'
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
})