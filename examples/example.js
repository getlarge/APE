const BpmnEngine = require('bpmn-engine');
const {EventEmitter} = require('events');

const processXml = `
<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  <process id="theProcess" isExecutable="true">
    <startEvent id="start" />
    <endEvent id="end">
      <extensionElements>
        <camunda:InputOutput>
          <camunda:inputParameter name="data">\${variables.statusCode}</camunda:inputParameter>
        </camunda:InputOutput>
      </extensionElements>
    </endEvent>
    <sequenceFlow id="flow1" sourceRef="start" targetRef="end" />
  </process>
</definitions>`;

const listener = new EventEmitter();

listener.on('end', (activity) => {
  if (activity.isEnd) {
    console.log(`${activity.type} <${activity.id}> input is`, activity.getInput());
  }
});

const engine = new BpmnEngine.Engine({
  source: processXml,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  }
});
engine.execute({
  listener,
  variables: {
    statusCode: 200
  }
}, (err) => {
  if (err) console.log(err)
});
engine.once('end', (def) => {
  console.log('completed', def.variables);
});