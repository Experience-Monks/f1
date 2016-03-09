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
  var onInState = noOp;
  var stateChief;
  var currentTargetState;
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

      stateChief = state;
      currentTargetState = {};

      driver.init(state);

      return this;
    },

    destroy: function() {
      driver.destroy();
    },

    go: function(state, onComplete) {
      stateChief = state;
      currentTargetState = {};

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
        currentTargetState[ target ] = toState;
        ui.init(toState);
      } else if(currentTargetState[ target ] !== toState) {
        currentTargetState[ target ] = toState;
        ui.go(toState, onTargetInState.bind(undefined, target, toState));
      }
    }
  }

  function onTargetInState(target, targetState) {
    // set the current target as being in the state it should be in
    targetsInState[ target ] = opts.states[ stateChief ][ target ] === targetState;

    // now check if all states are in the state they should be in
    var allInState = Object.keys(targetsInState)
    .reduce(function(allInState, key) {
      return allInState && targetsInState[ key ];
    }, true);

    if(allInState) {
      onInState();
    }
  }
};