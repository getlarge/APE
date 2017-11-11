'use strict';

const fs = require('fs');

const Bpmn = require('bpmn-engine');
const services = require('../Services');

const sourceXml = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definitions_1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.10.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:serviceTask id="recurring" name="Each item">
      <bpmn:extensionElements>
        <camunda:connector>
          <camunda:inputOutput>
            <camunda:outputParameter name="sum"><![CDATA[${result[0]}
]]></camunda:outputParameter>
          </camunda:inputOutput>
          <camunda:connectorId>loop</camunda:connectorId>
        </camunda:connector>
      </bpmn:extensionElements>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" camunda:collection="${variables.input}" />
    </bpmn:serviceTask>
    <bpmn:boundaryEvent id="errorEvent" attachedToRef="recurring">
      <bpmn:errorEventDefinition />
    </bpmn:boundaryEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="ServiceTask_1l50wpv_di" bpmnElement="recurring">
        <dc:Bounds x="314" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BoundaryEvent_1w6twmq_di" bpmnElement="errorEvent">
        <dc:Bounds x="396" y="142" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="414" y="182" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const engine = new Bpmn.Engine({
  source: fs.readFileSync('../resources/TaskLoop.bpmn'),
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});


engine.execute({
  services: services,
  variables: {
    input: [1, 2, 3, 7]
  }
});

engine.once('end', (err, definition) => {
  console.log(definition.variables.sum, 'aught to be 13 blazing fast');
});