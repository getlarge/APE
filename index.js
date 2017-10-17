const fs = require('fs');
const BPMNExecutor = require('./app/BPMNExecutor');
const queue = require('./app/SimpleQueue');
const storage = require('./app/SimpleStorage');
const aloesService = require('./app/AloesService');
const chatService = require('./app/ChatService');


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
		const executor = new BPMNExecutor(queue, storage);
		const proccess2 = executor.runProccess(fs.readFileSync(__dirname + '/resources/diagram_5.bpmn').toString(), {}, 'process2');
	}
};



