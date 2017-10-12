const fs = require('fs');
const BPMNExecutor = require('./app/BPMNExecutor');
const queue = require('./app/SimpleQueue');
const storage = require('./app/SimpleStorage');

const executor = new BPMNExecutor(queue, storage);
//const xml1 = fs.readFileSync(__dirname + '/resources/diagram_1.bpmn').toString();
const xml2 = fs.readFileSync(__dirname + '/resources/diagram_3.bpmn').toString();

//const proccess1 = executor.runProccess(xml1, {}, 'process1');
const proccess2 = executor.runProccess(xml2, {}, 'process2');


