var f1 = require('../..');

module.exports = function(onUpdate) {

  var states = {
    out: {
      item: {
        value: 0
      }
    },

    idle: {
      item: {
        value: 100
      }
    },

    rolled: {
      item: {
        value: 200
      }
    }
  };

  var transitions = [
    { from: 'out', to: 'idle' },
    { from: 'idle', to: 'rolled' },
    { from: 'rolled', to: 'idle' }
  ];

  var parsers = {
    update: [
      function(target, state) {
        for(var i in state) {
          target[ i ] = state[ i ];
        }
      }
    ]
  };

  return f1({
    states: states,

    transitions: transitions,

    targets: {
      item: {}
    },

    parsers: parsers,

    onUpdate: onUpdate
  });
};