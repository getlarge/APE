const uuid = require('uuid/v4');

const {
  STATUS_IDLE,
  STATUS_BUSY,
  STATUS_FAILED,
  STATUS_COMPLETED
} = require('./constants');

class Job {
  constructor(name, payload) {
    this.id = uuid();
    this.name = name;
    this.payload = payload;
    this.eventListeners = [];
    this.status = STATUS_IDLE;
  }

  markAsBusy() {
    this.status = STATUS_BUSY;
  }

  markAsFailed() {
    this.status = STATUS_FAILED;
  }

  markAsCompleted() {
    this.status = STATUS_COMPLETED;
  }

  on(event, callback) {
    this.eventListeners.push({event, callback});
  }

  fire(event, data) {
    this.eventListeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }

  sendWorkData(payload) {
    this.fire('workData', payload);
  }

  workComplete(payload) {
    this.fire('complete', payload);
  }
}

module.exports = Job;
