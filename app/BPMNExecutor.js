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
        //engine.execute(this.getOptions(payload, listener));
        engine.execute(this.getOptions(payload, listener),(err) => {
          if (err) console.log(err)
        });
      }

      engine.once('end', (def) => {
        console.log('End of step', def.variables);
        resolve()
      });

      engine.on('error', e => {
        console.log('ERROR: ', e);
        resolve();
      });

      listener.on('start', task => {
                      
        switch(task.type) {

          case 'bpmn:Process':
            if (stepsCounter == 0) {
              console.log('<!-- START APE -->');
              console.log('start', `${task.type} <${task.id}>`);
            }
            break;

          case 'bpmn:ServiceTask':
            console.log('start', task.type, task.id);
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

      //listener.once('wait', (task) => {
      //  console.log(`${task.type} <${task.id}>`);
      //  engine.signal(task.id);
      //});
      
      //listener.on('end', (task) => {
          //console.log(`${task.type} <${task.id}>`);
      //});

      //listener.on('wait-userTask', (task, instance) => {
      //  console.log(`${task.type} <${task.id}> of ${instance.id} is waiting for input`);
      //  task.signal('don´t wait for me');
      //});

      listener.on('wait', (task) => {

        console.log(`${task.type} <${task.id}> is waiting for signal`);
        switch (task.id) {
          
          case 'Task1' :
            return task.signal({name: 'kebab-case-draft'});
            break;
          
          case 'Task2' :
            return task.signal({finalName: 'camelCase'});
            break;

          case 'ServiceTask_PingAloes' :
            console.log('yeah');
            return task.signal({output: 'kebab-case-draft'});
            break;

          default :
            task.signal();
        
        }

      });

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
