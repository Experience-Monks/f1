var kimi = require('kimi');
var noOp = require('no-op');
var parseStates = require('./lib/states/parseStates');
var parseTransitions = require('./lib/transitions/parseTransitions');
var extend = require('deep-extend');

module.exports = function(options) {

  var opts = options || {};
  var driver = kimi({
    manualStep: opts.autoUpdate === undefined ? false : !opts.autoUpdate,
    onUpdate: onUpdate
  });
  var countInState = 0;
  var countTargets = 0;
  var onInState = noOp;

  var marshal = {
    targets: function(targets) {
      opts.targets = targets;
    },

    states: function(states) {
      opts.states = states;
    },

    transitions: function(transitions) {
      opts.transitions = transitions;
    },

    init: function(state) {
      var transitions;

      if(opts.targets === undefined) {
        throw new Error('You must pass in targets to marshal');
      }

      if(opts.states === undefined) {
        throw new Error('You must pass in states to marshal');
      }

      if(opts.transitions === undefined) {
        throw new Error('You must pass in transitions to marshal');
      }

      // for marshal we want to make the default duration to be 0
      transitions = opts.transitions.map(function(transition) {
        transition = extend(
          {},
          transition
        );

        transition.animation = transition.animation || {};
        transition.animation.duration = transition.animation.duration === undefined ? 0 : transition.animation.duration;

        return transition;
      });

      parseStates(driver, opts.states);
      parseTransitions(driver, opts.states, transitions);

      countTargets = Object.keys(opts.targets).length;

      driver.init(state);

      return this;
    },

    go: function(state, onComplete) {
      countInState = 0;

      onInState = onComplete || noOp

      driver.go(state);

      return this;
    },

    step: function(deltaTime) {

      driver.step(deltaTime);

      return this;
    }
  };

  return marshal;

  function onUpdate(state) {
    for(var target in state) {
      var ui = opts.targets[ target ];
      var toState = state[ target ];

      if(!ui.isInitialized) {
        ui.init(toState);
      } else {
        ui.go(toState, onTargetInState);
      }
    }
  }

  function onTargetInState() {
    countInState++;

    if(countInState === countTargets) {
      onInState();
    }
  }
};