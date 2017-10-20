const Bpmn = require('bpmn-engine');
const uuid = require('uuid/v4');
const EventEmitter = require('events').EventEmitter;
const services = require('./Services');
let stepsCounter = 0;

class BPMNExecutor {
  constructor(queueManager, storage) {
    this.OPERATIONS_LIMIT_BY_STEP = 2;
    this.started = false;
    this.queueManager = queueManager;
    this.storage = storage;
    this.listeners = {};
    this.queueManager.addFunction('bpmn', (job, callback) => {
      job.sendWorkData(job.payload.scriptID);
      return this.executeStep(job.payload.scriptID)
        .then(() => {
          job.workComplete();
          callback(job);
          this.addProccessToQueue(job.payload.scriptID);
        })
        .catch(e => {
          console.log('ERROR', e);
        });
    });
  }

  //getOptions(variables = {noun: 'tea'}, listener) {
  getOptions(variables = {}, listener) {
    return {
      variables,
      services,
      listener,
    };
  }

  runProccess(bpmnXML, payload, scriptID) {
    const PID = scriptID || uuid();
    this.storage.set(`bpmn_${PID}`, {bpmnXML, payload}, () => {
      this.addProccessToQueue(PID);
    });
    return PID;
  }

  executeStep(scriptID) {
    return new Promise(resolve => {
      console.log('Start Step :', stepsCounter);
      let steps = this.OPERATIONS_LIMIT_BY_STEP;
      const {bpmnXML, payload} = this.storage.get(`bpmn_${scriptID}`);
      let engine;
      const listener = new EventEmitter();

      if (this.storage.has(`state_${scriptID}`)) {
        // Has saved state -- resume execution
        const state = this.storage.get(`state_${scriptID}`);
        // @TODO hydrate state by camundaState and xml


        engine = Bpmn.Engine.resume(state, this.getOptions(payload, listener));
      } else {
        engine = new Bpmn.Engine({
          name: 'Script',
          source: bpmnXML,
          moddleOptions: {
            camunda: require('camunda-bpmn-moddle/resources/camunda'),
          },
        });
        engine.execute(this.getOptions(payload, listener));
      }

      engine.once('end', (def) => {
        console.log('End of step', def.getOutput());
        resolve()
      });

      engine.on('error', (e, source) => {
        console.log('ERROR : ', e, '| SOURCE :', source);
        resolve();
      });

//// EVENT LISTENERS /////

//// START ////      
      listener.on('start', task => {
                      
        switch(task.type) {

          case 'bpmn:Process':
            if (stepsCounter == 0) {
              console.log('<!-- START APE -->');
              engine.getDefinitions((err, definitions) => {
              if (err) throw err;
                console.log('Loaded', definitions[0].id);
                console.log('The definition comes with process', definitions[0].getProcesses()[0].id);
              });
              console.log('start', `${task.type} <${task.id}>`);
            }
            break;

          case 'bpmn:ServiceTask':
            console.log('start', task.type, task.id);
            console.log('serviceTaskProperties', task.name);
            console.log('serviceTaskInput', task.getInput());
            console.log('serviceTaskOutput', task.getOutput());
            break;

          case 'bpmn:StartEvent':
            console.log('start', `${task.type} <${task.id}>`);
            break;
          
          case 'bpmn:UserTask':
            console.log('start', `${task.type} <${task.id}>`);
            console.log('userTaskInput', task.getInput());
            console.log('userTaskOutput', task.getOutput());
            break;
          
          default :
            console.log('Start', `${task.type} <${task.id}>`, task.variables, '| Step Limit :', steps);
        }

        if (!steps) {
          this.saveState(engine, scriptID);
          engine.stop();
        }
        
        --steps; 
        ++stepsCounter;
      });

//// LEAVE ////
      listener.on('leave', task => {

        switch(task.type) {

          case 'bpmn:EndEvent':
            resolve({
              type: 'end',
              result: 'toto' // message = object of «input parameter : value» pairs
            })
            console.log('<!-- END APE -->');
            this.saveState(engine, scriptID);
            engine.stop();
            process.exit(1);            
            break;
          
          default :
            console.log('leave', `${task.type} <${task.id}>`, steps, stepsCounter);
            //console.log('leave', task.id)
        }

      });

//// WAIT //// compose event name with "wait" and user task id, or just "wait" to listen for all waits
      listener.on('wait', (task) => {

        const {form, formKey, id, signal, type} = task;

        if (form) {
          console.log(`activity ${type} <${id}> setting form field`);
          form.getFields().forEach(({id, get, label}, idx) => {
            form.setFieldValue(id, `value${idx}`);
            console.log(`  ${label} <${id}> = ${get()}`);
            });
          return signal(form.getOutput())
        } else if (formKey) {
          console.log(`activity ${type} <${id}> expects form with key "${formKey}"`);
          return signal({ key: formKey });
        }

        console.log(`${type} <${id}> is waiting for signal`);

        switch (id) {
          
          case 'Task1' :
            return signal({name: 'kebab-case-draft'});
            break;
          
          case 'Task2' :
            return signal({finalName: 'camelCase'});
            break;

          case 'ServiceTask_PingAloes' :
            console.log('yeah');
            return signal({output: 'kebab-case-draft'});
            break;

          default :
            return signal();
        
        }

      });

      listener.once('wait', (activity) => {
        console.log(`${activity.type} <${activity.id}>`);
        engine.signal(activity.id);
      });

      //listener.on('wait-userTask', (task, instance) => {
      //  console.log(`${task.type} <${task.id}> of ${instance.id} is waiting for input`);
      //  task.signal('don´t wait for me');
      //});

//// TAKEN //// NOT Working with Camunda Modeler BPMN
      listener.on('taken', (flow) => {
        console.log(`flow <${flow.id}> was taken`);
      });

//// ERROR ////     
      listener.on('error', (err) => {
        console.log(`Error <${error}> occured`);
      });

      //listener.on('end', (task) => {
          //console.log(`${task.type} <${task.id}>`);
      //});

    });
  }

  addProccessToQueue(scriptID) {
    this.queueManager.submitJob('bpmn', {scriptID});
  }

  saveState(engine, scriptID) {
    const state = engine.getState();
    // @TODO cleanup garbage from state
    this.storage.set(`state_${scriptID}`, state, () => {}, true);
  }

  clearState(engine, scriptID) {
    console.log('Clear state...');
    // @TODO cleanup garbage from state
    this.storage.remove(`state_${scriptID}`);
  }
}

module.exports = BPMNExecutor;
