'use strict';

const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;

// Retrieve saved state
const state = db.getState('some-random-id', (err, state) => {
  if (err) return console.log(err.message);

  const engine = Bpmn.Engine.resume(state);
  engine.on('end', () => {
    console.log('resumed instance completed');
  });
});
