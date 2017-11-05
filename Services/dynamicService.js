'use strict';

const AloesService = require('../app/AloesClient');

//call with something like : <serviceTask id="serviceTask" name="Get" camunda:expression="${services.dynamicService(variables.result)" camunda:resultVariable="result" />
module.exports.dynamicService = (message) => {
	let {action, deviceId} = message;
  	action = action || 'ping';
  	deviceId = deviceId || '';

  	if (message) {
  		console.log('message :', message);
    	return whenMessage;
  	}

  	if (deviceId == '') {
  		console.log('action :', action);
    	return simpleAction;
  	}

  	if (deviceId != '') {
  		console.log('deviceId :', deviceId);
    	return deviceAction;
  	}

  	else {
  		return noInput;
  	}; 
}; 

function simpleAction(context, next) {
	next(AloesClient.send({'action': action}, () => {
    	console.log('simpleAction');
    }));
};

function deviceAction(context, next) {
 	next(AloesClient.send({'action': action, 'deviceId': deviceId}, () => {
    	console.log('deviceAction');
    }));
};

function whenMessage(context, next) {
 	next(console.log('whenMessage'));
};

function noInput(context, next) {
 	next(null, 1);
};
