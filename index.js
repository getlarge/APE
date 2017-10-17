const fs = require('fs');
const BPMNExecutor = require('./app/BPMNExecutor');
const queue = require('./app/SimpleQueue');
const storage = require('./app/SimpleStorage');
const aloesService = require('./app/AloesService');
const chatService = require('./app/ChatService');

const executor = new BPMNExecutor(queue, storage);
//const xml1 = fs.readFileSync(__dirname + '/resources/diagram_1.bpmn').toString();
const xml2 = fs.readFileSync(__dirname + '/resources/diagram_5.bpmn').toString();

//const proccess1 = executor.runProccess(xml1, {}, 'process1');

let servicesConnected = 0;

chatService.on('connected', () => {
	servicesConnected++;
	init(servicesConnected);
});

aloesService.on('connected', () => {
	servicesConnected++;
	init(servicesConnected);
});

let init = (servicesConnected) => {
	if(servicesConnected > 1) {
		const proccess2 = executor.runProccess(xml2, {}, 'process2');
	}
};



