'use strict';

//call with something like : <serviceTask id="serviceTask" name="Get" camunda:expression="${services.getService(variables.result)" camunda:resultVariable="result" />
module.exports.dynamicService = (input) => {
  if (input) {
    return whenInput;
  }
  return noInput;
}; 

function whenInput(context, next) {
 next(null);
};

function noInput(context, next) {
 next(null, 1);
};
