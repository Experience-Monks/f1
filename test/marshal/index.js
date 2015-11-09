var marshal = require('../../marshal');
var getUI = require('./getUI');

module.exports = function(t) {

  var ui1 = getUI(function(value, state, time) {
    console.log('ui1 update', value, state, time);
  });

  var ui2 = getUI(function(value, state, time) {
    console.log('ui2 update', value, state, time);
  });

  var controller = marshal({
    autoUpdate: false,

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

  controller.go('rolled', function() {
    
    controller.go('idle', function() {
      t.end();
    });
  });
};