'use strict';

const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;

const definitionSource = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions id="pending" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  <process id="theWaitingGame" isExecutable="true">
    <startEvent id="start" />
    <parallelGateway id="fork" />
    <userTask id="userTask1" />
    <userTask id="userTask2">
      <extensionElements>
        <camunda:formData>
          <camunda:formField id="surname" label="Surname" type="string" />
          <camunda:formField id="givenName" label="Given name" type="string" />
        </camunda:formData>
      </extensionElements>
    </userTask>
    <task id="task" />
    <parallelGateway id="join" />
    <endEvent id="end" />
    <sequenceFlow id="flow1" sourceRef="start" targetRef="fork" />
    <sequenceFlow id="flow2" sourceRef="fork" targetRef="userTask1" />
    <sequenceFlow id="flow3" sourceRef="fork" targetRef="userTask2" />
    <sequenceFlow id="flow4" sourceRef="fork" targetRef="task" />
    <sequenceFlow id="flow5" sourceRef="userTask1" targetRef="join" />
    <sequenceFlow id="flow6" sourceRef="userTask2" targetRef="join" />
    <sequenceFlow id="flow7" sourceRef="task" targetRef="join" />
    <sequenceFlow id="flowEnd" sourceRef="join" targetRef="end" />
  </process>
</definitions>
    `;

const engine = new Bpmn.Engine({
  name: 'Pending game',
  source: definitionSource,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});

const listener = new EventEmitter();

engine.execute({
  listener: listener
}, (err, execution) => {
  if (err) throw err;
});

setTimeout(() => {
  const pending = engine.getPendingActivities();
  console.log(JSON.stringify(pending, null, 2));

  const task = pending.definitions[0].children.find(c => c.type === 'bpmn:UserTask');

  engine.signal(task.id);
}, 300);
