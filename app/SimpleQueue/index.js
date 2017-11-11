const uuid = require('uuid/v4');
const async = require('async');
const SimpleStorage = require('../SimpleStorage');
const Job = require('./Job');
const Worker = require('./Worker');

class SimpleQueue {
  constructor(storage) {
    this.storage = storage;
    const jobs = this.storage.get(`queue_jobs`) || [];
    this.jobs = jobs.map(job => new Job(job.name, job.payload));
    this.workers = [];
    this.isRun = false;
  }

  async submitJob(name, payload) {
    const job = new Job(name, payload);
    // this.persistQueue();
    const worker = this.workers.find(worker => worker.name === name);
    if (!worker) {
      throw new Error('There is no worker')
    }
    await worker.listener.push(job);

    return job;
  }

  persistQueue() {
    this.storage.set(`queue_jobs`, this.jobs, null, true);
  }

  addFunction(name, listener) {
    this.workers.push(
      new Worker(`WORKER#${this.workers.length}`, name, async.queue(listener))
    );
  }

  setWorkerId(workerId) {
    //STUB
  }
}

const simpleQueue = new SimpleQueue(SimpleStorage);

module.exports = simpleQueue;
