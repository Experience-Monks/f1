var chief = require('../../chief');
var getUI = require('./getUI');

module.exports = function(t) {

  var hasGoneIntoRolled = false;
  var hasGoneIntoRolled2 = false;
  var hasGoneIntoIdle = false;

  var values = {
    out: 0,
    idle: 100,
    rolled: 200
  };
  var target1 = {};
  var target2 = {};

  var ui1 = getUI(target1, values);
  var ui2 = getUI(target2, values);

  var controller = chief({
    // autoUpdate: false,

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
      },

      rolled2: {
        ui1: 'idle',
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

      { from: 'idle', to: 'rolled', bi: true },
      { from: 'rolled', to: 'rolled2', bi: true }
    ]
  });

  controller.init('out');
  t.equal(target1.value, values.out, 'target1 init to out');
  t.equal(target2.value, values.out, 'target2 init to out');

  // just a regular animation
  controller.go('rolled', function() {
    hasGoneIntoRolled = true;
    t.equal(target1.value, values.rolled, 'target1 went to rolled');
    t.equal(target2.value, values.rolled, 'target2 went to rolled');
    

    // this is to test attempting to control ui that are going to the same states
    controller.go('rolled2', function() {
      hasGoneIntoRolled2 = true;
      t.equal(target1.value, values.idle, 'target1 went to idle');
      t.equal(target2.value, values.rolled, 'target2 went to rolled');

      // test going back to idle
      controller.go('idle', function() {
        hasGoneIntoIdle = true;
        t.equal(target1.value, values.idle, 'target1 went to idle');
      t.equal(target2.value, values.idle, 'target2 went to idle');
      });
    });
  });

  setTimeout(function() {
    t.ok(hasGoneIntoRolled, 'went from from out to rolled state');
    t.ok(hasGoneIntoRolled2, 'went from rolled to rolled2 state');
    t.ok(hasGoneIntoIdle, 'went from rolled2 to idle state');
    t.end();
  }, 3000);
};