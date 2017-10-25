const fs = require('fs');
const BPMNExecutor = require('./app/BPMNExecutor');
const queue = require('./app/SimpleQueue');
const storage = require('./app/SimpleStorage');
const aloesService = require('./app/AloesService');
const chatService = require('./app/ChatService');
const krakenService = require('./app/KrakenService');

let servicesConnected = 0;

aloesService.on('connected', () => {
	servicesConnected++;

	setTimeout(function(){
		init(servicesConnected);
	}, 1000);
});

chatService.on('connected', () => {
	servicesConnected++;
	init(servicesConnected);
});

krakenService.on('connected', () => {
	servicesConnected++;
	init(servicesConnected);
});

let init = (servicesConnected) => {
	if(servicesConnected > 1) {
		const executor = new BPMNExecutor(queue, storage);
		const proccess1 = executor.runProccess(fs.readFileSync(__dirname + '/resources/diagram_5.bpmn').toString(), {}, 'process1');
		//const proccess2 = executor.runProccess(fs.readFileSync(__dirname + '/resources/variables-output.bpmn').toString(), {}, 'process2');
	}
};



