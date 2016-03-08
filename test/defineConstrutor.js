var f1 = require('./..');


var EXPECTED_STATES = [
  [
    {
      "item": {
        "value": 0
      }
    },
    "out"
  ],
  [
    {
      "item": {
        "value": 100
      }
    },
    "idle"
  ]
];


var EXPECTED_UPDATES = [
  [
    {
      "item": {
        "value": 30
      }
    },
    "out",
    0.3,
    1
  ],
  [
    {
      "item": {
        "value": 60
      }
    },
    "out",
    0.6,
    1
  ],
  [
    {
      "item": {
        "value": 90
      }
    },
    "out",
    0.9,
    1
  ]
];






module.exports = function(t) {

  var cbStates = [];
  var cbUpdates = [];

  var item = {};
  var ui = f1({
    autoUpdate: false,
    onState: callBackState,
    onUpdate: callBackUpdate,
    states: {
      out: {
        item: {
          value: 0
        }
      },

      idle: {
        item: {
          value: 100
        }
      }
    },
    transitions: [
      { from: 'out', to: 'idle', animation: {
          duration: 1
        } 
      }
    ],
    targets: {
      item: item
    },
    parsers: {
      update: [
        function(target, state) {
          for(var i in state) {
            target[ i ] = state[ i ];
          }
        }
      ]
    }
  });

  ui.init('out');
  ui.go('idle');

  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);

  t.deepEqual(cbStates, EXPECTED_STATES, 'callback states matched expected');
  t.deepEqual(cbUpdates, EXPECTED_UPDATES, 'callback updates matched expected');
  t.end();

  function callBackState() {
    cbStates.push(Array.prototype.slice.call(arguments));
  }

  function callBackUpdate() {
    cbUpdates.push(Array.prototype.slice.call(arguments));
  }
};