var kimi = require('kimi');
var noOp = require('no-op');
var parseStates = require('./lib/states/parseStates');
var parseTransitions = require('./lib/transitions/parseTransitions');
var extend = require('deep-extend');

module.exports = function(options) {

  var opts = options || {};
  var driver = kimi({
    manualStep: opts.autoUpdate === undefined ? false : !opts.autoUpdate,
    onUpdate: options.onUpdate || onUpdate.bind(undefined, onTargetInState)
  });
  var targetsCurrent = {};
  var onInState = noOp;
  var targetsInState;


  var chief = {
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
        throw new Error('You must pass in targets to chief');
      }

      if(opts.states === undefined) {
        throw new Error('You must pass in states to chief');
      }

      if(opts.transitions === undefined) {
        throw new Error('You must pass in transitions to chief');
      }

      // for chief we want to make the default duration to be 0
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

      driver.init(state);

      return this;
    },

    go: function(state, onComplete) {
      targetsInState = Object.keys(opts.states[ state ])
      .reduce(function(targetsInState, key) {
        targetsInState[ key ] = false;

        return targetsInState;
      }, {});

      onInState = onComplete || noOp

      driver.go(state);

      return this;
    },

    step: function(deltaTime) {

      driver.step(deltaTime);

      return this;
    }
  };

  return chief;

  function onUpdate(onTargetInState, state) {
    for(var target in state) {
      var ui = opts.targets[ target ];
      var toState = state[ target ];

      if(!ui.isInitialized) {
        targetsCurrent[ target ] = toState;
        ui.init(toState);
      } else if(targetsCurrent[ target ] !== toState) {
        targetsCurrent[ target ] = toState;
        ui.go(toState, onTargetInState.bind(undefined, target));
      }
    }
  }

  function onTargetInState(target) {
    targetsInState[ target ] = true;

    var allInState = Object.keys(targetsInState)
    .reduce(function(allInState, key) {
      return allInState && targetsInState[ key ];
    }, true);

    if(allInState) {
      onInState();
    }
  }
};