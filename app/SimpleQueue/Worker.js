const JOB_TIMEOUT = 30000; // Timeout 30 secs
const {
  STATUS_IDLE,
  STATUS_BUSY,
} = require('./constants');

class Worker {
  constructor(id, name, listener) {
    this.id = id;
    this.name = name;
    this.listener = listener;
    this.status = STATUS_IDLE;
  }

  markAsBusy() {
    this.status = STATUS_BUSY;
  }

  markAsIdle() {
    this.status = STATUS_IDLE;
  }
}

module.exports = Worker;
