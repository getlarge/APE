const fs = require('fs');
const BPMNExecutor = require('./src/BPMNExecutor');
const queue = require('./src/SimpleQueue');
const storage = require('./src/SimpleStorage');

const executor = new BPMNExecutor(queue, storage);
//const xml1 = fs.readFileSync(__dirname + '/diagram_1.bpmn').toString(); //Kazan
const xml2 = fs.readFileSync(__dirname + '/diagram_2.bpmn').toString();
//const xml2 = fs.readFileSync(__dirname + '/diagram_4.bpmn').toString();

//const proccess1 = executor.runProccess(xml1, {}, 'process1');
const proccess2 = executor.runProccess(xml2, {}, 'process2');
//const proccess2 = executor.runProccess(xml2, {}, 'process2');


