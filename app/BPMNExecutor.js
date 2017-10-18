const Bpmn = require('bpmn-engine');
const uuid = require('uuid/v4');
const EventEmitter = require('events').EventEmitter;
const services = require('./Services');

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
      console.log('Start step');
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

      engine.once('end', (task, def) => {
        console.log('End of step', def.variables);
        resolve()
      });

      //engine.once('end', () => {
      //  console.log('End of step')
      //  resolve()
      //});

      engine.on('error', e => {
        console.log('ERROR: ', e);
        resolve();
      });

      listener.on('leave', task => {
        console.log('leave', task.id)
        if (task.type === 'bpmn:EndEvent') {
          resolve({
            type: 'end',
            result: 'toto' // message = object of «input parameter : value» pairs
          })
         // console.log(this.result);
          console.log('<!-- END -->');
          this.saveState(engine, scriptID);
          engine.stop();
          process.exit(1);
        }
      });

      //listener.once('wait', (task) => {
      //  console.log(`${task.type} <${task.id}>`);
      //  engine.signal(task.id);
      //});
      
      //listener.on('end', (task) => {
          //console.log(`${task.type} <${task.id}>`);
      //});

      listener.on('wait-userTask', (task, instance) => {
        console.log(`${task.type} <${task.id}> of ${instance.id} is waiting for input`);
        task.signal('don´t wait for me');
      });

      listener.on('start', task => {
        console.log('start', `${task.type} <${task.id}>`, steps);
        //console.log(task.getPropertyValue);
        if (!steps) {
          this.saveState(engine, scriptID);
          engine.stop();
        }
        --steps; // Why ?
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
