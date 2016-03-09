var f1 = require('../..');

module.exports = function(target, values, onUpdate) {

  target = target || {};
  values = values || {
    out: 0,
    idle: 100,
    rolled: 200
  };

  var states = {
    out: {
      item: {
        value: values.out
      }
    },

    idle: {
      item: {
        value: values.idle
      }
    },

    rolled: {
      item: {
        value: values.rolled
      }
    }
  };

  var transitions = [
    { from: 'out', to: 'idle' },
    { from: 'idle', to: 'rolled', bi: true }
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
      item: target
    },

    parsers: parsers,

    onUpdate: onUpdate
  });
};