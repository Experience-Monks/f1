var f1 = require('./..');

var EXPECTED_GO_CALLBACK = [ { item: { value: 100 } }, 'idle' ];

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
        "value": 0
      }
    },
    "out",
    0
  ],
  [
    {
      "item": {
        "value": 30
      }
    },
    "out",
    300
  ],
  [
    {
      "item": {
        "value": 60
      }
    },
    "out",
    600
  ],
  [
    {
      "item": {
        "value": 90
      }
    },
    "out",
    900
  ],
  [
    {
      "item": {
        "value": 100
      }
    },
    "idle",
    0
  ]
];






module.exports = function(t) {

  var eventStates = [];
  var eventUpdates = [];
  var cbStates = [];
  var cbUpdates = [];
  var goCallback = null;

  var item = {};
  var ui = f1({
    autoUpdate: false,
    onState: callBackState,
    onUpdate: callBackUpdate
  });

  ui.states({
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
  });

  ui.transitions([
    { from: 'out', to: 'idle', animation: {
        duration: 1
      } 
    }
  ]);

  ui.targets({
    item: item
  });

  ui.parsers({
    update: [
      function(target, state) {
        for(var i in state) {
          target[ i ] = state[ i ];
        }
      }
    ]
  });

  ui.on('state', eventState);
  ui.on('update', eventUpdate);

  ui.init('out');
  ui.go('idle', function() {
    goCallback = Array.prototype.slice.call(arguments);
  });

  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);
  ui.step(300);

  t.deepEqual(goCallback, EXPECTED_GO_CALLBACK, 'go callback was correct');
  t.deepEqual(eventStates, EXPECTED_STATES, 'event states matched expected');
  t.deepEqual(eventUpdates, EXPECTED_UPDATES, 'event updates matched expected');
  t.deepEqual(cbStates, EXPECTED_STATES, 'callback states matched expected');
  t.deepEqual(cbUpdates, EXPECTED_UPDATES, 'callback updates matched expected');
  t.end();

  function eventState() {
    eventStates.push(Array.prototype.slice.call(arguments));
  }

  function eventUpdate() {
    eventUpdates.push(Array.prototype.slice.call(arguments));
  }

  function callBackState() {
    cbStates.push(Array.prototype.slice.call(arguments));
  }

  function callBackUpdate() {
    cbUpdates.push(Array.prototype.slice.call(arguments));
  }
};