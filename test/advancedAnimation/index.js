var f1 = require('./../..');
var eases = require('eases');
var getFuzzyTest = require('test-fuzzy-array');

var EXPECTED_STATES = require('./expectedStates');
var EXPECTED_UPDATES = require('./expectedUpdates');

module.exports = function(t) {

  var cbStates = [];
  var cbUpdates = {
    delayedValue: [],
    easedValue: [],
    durationValue: []
  };

  var item = {};
  var ui = f1({
    autoUpdate: false,
    onState: callBackState,
    onUpdate: callBackUpdate,
    states: {
      out: {
        item: {
          delayedValue: 0,
          easedValue: 0,
          durationValue: 0
        }
      },

      idle: {
        item: {
          delayedValue: 100,
          easedValue: 100,
          durationValue: 100
        }
      }
    },
    transitions: [
      { from: 'out', to: 'idle', animation: {
          duration: 1,

          item: {

            delayedValue: {
              delay: 0.5
            },

            easedValue: {
              ease: eases.expoOut
            },

            durationValue: {
              duration: 0.5
            }
          }
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

  for(var i = 0; i < 100000; i++) {
    ui.step(40);
  }

  getFuzzyTest(t, 0.01)(cbUpdates.delayedValue, EXPECTED_UPDATES.delayedValue, 'delayedValue were correctish');
  getFuzzyTest(t, 0.01)(cbUpdates.easedValue, EXPECTED_UPDATES.easedValue, 'easedValue were correctish');
  getFuzzyTest(t, 0.01)(cbUpdates.durationValue, EXPECTED_UPDATES.durationValue, 'durationValue were correctish');
  t.end();

  function callBackState() {
    cbStates.push(Array.prototype.slice.call(arguments));
  }

  function callBackUpdate(value) {

    cbUpdates.delayedValue.push(item.delayedValue);
    cbUpdates.durationValue.push(item.durationValue);
    cbUpdates.easedValue.push(item.easedValue);
  }
};