var marshal = require('../../marshal');
var getUI = require('./getUI');

var ui1 = getUI(function(value, state, time) {
  console.log('ui1 update', state);
});
var ui2 = getUI(function(value, state, time) {
  console.log('ui2 update', state);
});

var controller = marshal({
  states: {
    out: {
      ui1: 'out',
      ui2: 'out'
    },

    idle: {
      ui1: 'idle',
      ui2: 'idle'
    },

    rolled: {
      ui1: 'rolled',
      ui2: 'rolled'
    }
  },

  targets: {
    ui1: ui1,
    ui2: ui2
  },

  transitions: [
    { from: 'out', to: 'idle', animation: {
        
        ui2: {
          delay: 0.5
        }
      } 
    },

    { from: 'idle', to: 'rolled' },
    { from: 'rolled', to: 'idle' }
  ]
});

controller.init('out');

console.log('ui starting');
controller.go('rolled', function() {
  console.log('ui is in rolled');

  controller.go('idle', function() {
    console.log('ui is idle');
  });
});