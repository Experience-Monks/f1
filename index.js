var kimi = require('kimi');
var f1Parser = require('f1-parser');
var getTween = require('tween-function');
var noop = require('no-op');
var extend = require('extend');
var Emitter = require('events').EventEmitter;

var parseStates = require('./lib/states/parseStates');
var parseTransitions = require('./lib/transitions/parseTransitions');
var parseAnimatables = require('./lib/animatables/parseAnimatables');

var numInstances = 0;

module.exports = f1;

/**
 * To construct a new `f1` instance you can do it in two ways.
 * 
 * ```javascript
 * ui = f1([ settigns ]);
 * ```
 * or 
 * ```javascript
 * ui = new f1([ settings ]);
 * ```
 * 
 * To construct an `f1` instance you can pass in an optional settings object. The following are properties you can pass in settings:
 * ```javascript
 * {
 *   onState: listenerState, // this callback will be called whenever f1 reaches a state
 *   onUpdate: listenerUpdater, // this callback will be called whenever f1 is updating
 *
 *   // you can pass a name for the ui. This is useful when you're using an external tool or want
 *   // to differentiate between f1 instances
 *   name: 'someNameForTheUI',
 * 
 *   // this is an object which contains all elements/items that you will be animating
 *   targets: { 
 *     bg: bgElement 
 *   }, 
 * 
 *   // all states for the ui
 *   // states are the top level object and anything after that are the properties 
 *   // for that state
 *   states: { 
 *     out: {
 * 
 *       bg: { alpha: 0 } 
 *     },
 * 
 *     idle: {
 * 
 *       bg: { alpha: 1 }
 *     }
 *   },
 * 
 *   // an array which defines the transitions for the ui
 *   transitions: [
 *     'out', 'idle', // this ui can go from out to idle
 *     'idle', 'out' // and idle to out
 *   ],
 * 
 *   // an array of functions which will be able to take values
 *   // from a state define in states and apply it to the 
 *   // items defined in targets
 *   parsers: [ applyAlpha ]
 * }
 * ```
 * 
 * @param  {Object} [settings] An optional settings Object described above
 * @chainable
 */
function f1(settings) {

  if(!(this instanceof f1)) {

    return new f1(settings);
  }

  var emitter = this;
  var onUpdate = settings.onUpdate || noop;;
  var onState = settings.onState || noop;

  // this is used to generate a "name" for an f1 instance if one isn't given
  numInstances++;

  settings = settings || {};

  this.onState = function() {
    emitter.emit.apply(emitter, getEventArgs('state', arguments));
  };

  this.onUpdate = function() {
    emitter.emit.apply(emitter, getEventArgs('update', arguments));
  };

  this.name = settings.name || 'ui_' + numInstances;
  this.data = null; // current animation data
  this.animatables = null;
  this.defStates = null;
  this.defTransitions = null;
  this.parser = null;

  if(settings.transitions) {
    this.transitions(settings.transitions);
  }

  if(settings.states) {
    this.states(settings.states);
  }

  if(settings.targets) {
    this.targets(settings.targets);
  }

  if(settings.parsers) {
    this.parsers(settings.parsers);
  }

  // kimi is the man who does all the work under the hood
  this.driver = kimi( {

    onState: _onState.bind(this),
    onUpdate: _onUpdate.bind(this)
  });
}

f1.prototype = extend(Emitter.prototype, {

  /**
   * define which items are going to be animated. Pass in an object
   * which will look something like this:
   * ```javascript
   * var ui = require('f1')();
   *
   * ui.targets( {
   *
   *  itemToAnimate1: find('#itemToAnimate1'),
   *  itemToAnimate2: find('#itemToAnimate2')
   * });
   * ```
   * The `Object` being passed in should have variable names which will
   * associate to data which will be defined when setting up states in the
   * `f1.states` method. The value which you pass these can be anything.
   *
   * In this case `itemToAnimate1` and `itemToAnimate2` will be a HTML Elements.
   * 
   * @param  {Object} targets An Object which will define which items will be animated
   * @chainable
   */
  targets: function(targets) {

    this.animatables = parseAnimatables(targets);

    return this;
  },

  /**
   * defines the states which this `f1` instance will use.
   *
   * States are defined as objects. It could look something like this:
   * ```javascript
   * var ui = require('f1')();
   * 
   * ui.states( {
   *
   *  out: {
   *    itemToAnimate1: {
   *      variableToAnimate: 0
   *    },
   *
   *    itemToAnimate2: {
   *      variableToAnimate: 0
   *    }
   *  },
   *
   *  idle: {
   *    itemToAnimate1: {
   *      variableToAnimate: 1
   *    },
   *
   *    itemToAnimate2: {
   *      variableToAnimate: 2
   *    }
   *  }
   * });
   * ```
   * Above two states would be created: `out` and `idle`. Both would animate two
   * objects: `itemToAnimate1` and `itemToAnimate2`. And in both of those objects
   * the property `variableToAnimate` is defined. So if we were to transition from
   * `out` to `idle` in `itemToAnimate1` `variableToAnimate` would transition from
   * 0 to 1 and in `itemToAnimate2` from 0 to 2.
   *
   * States can also be defined by passing in objects for instance the above could
   * be changed to look like this:
   * ```javascript
   * var ui = require('f1')();
   * 
   * ui.states( {
   *
   *  out: function(stateName) {
   *
   *    console.log(stateName); // "out"
   * 
   *    return {
   *      itemToAnimate1: {
   *        variableToAnimate: 0
   *      },
   *  
   *      itemToAnimate2: {
   *        variableToAnimate: 0
   *      }
   *    };
   *  },
   *
   *  idle: function(stateName) {
   *
   *    console.log(stateName); // "idle"
   * 
   *    return {
   *      itemToAnimate1: {
   *        variableToAnimate: 1
   *      },
   *  
   *      itemToAnimate2: {
   *        variableToAnimate: 2
   *      }
   *    };
   *  }
   * });
   * ```
   * The above can be handy when there are many items which states must be defined for
   * instance a menu with many buttons.
   * 
   * @param  {Object} states defines all of the states for an `f1` instance
   * @chainable
   */
  states: function(states) {

    this.defStates = states;

    return this;
  },

  /**
   * defines how this `f1` instance can move between states. 
   *
   * For instance if we had two states out and idle you could define your transitions
   * like this:
   *
   * ```javascript
   * var ui = require('f1')();
   * 
   * ui.transitions( [
   *   'out', 'idle', // defines that you can go from the out state to the idle state
   *   'idle', 'out' // defines that you can go from the idle state to the out state
   * ]);
   * ```
   *
   * Note that transitions are not bi-directional.
   *
   * If you simply just defined state names a default animation would be applied between
   * states. This default transition will have a duration of 0.5 seconds and use no ease.
   *
   * If you want to modify the animation duration and ease you can define your transitions
   * like this:
   *
   * ```javascript
   * var eases = require('eases');
   * var ui = require('f1')();
   * 
   * ui.transitions( [
   *   'out', 'idle', { duration: 1, ease: eases.expoOut }, 
   *   'idle', 'out', { duration: 0.5, ease: eases.expoIn }
   * ]);
   * ```
   *
   * Defining your transitions using the above syntax will cause all properties to animate
   * using the duration and ease defined. 
   *
   * Ease functions should take a time property between 0-1 and return a modified value between
   * 0-1.
   * 
   * You can also animate properties individually. Here passing a delay maybe sometimes 
   * userful:
   * 
   * ```javascript
   * var eases = require('eases');
   * var ui = require('f1')();
   * 
   * ui.transitions( [
   *   'out', 'idle', { 
   *     duration: 1, ease: eases.expoOut,
   *
   *     position: { duration: 0.5, delay: 0.5, ease: eases.quadOut },
   *     alpha: { duration: 0.5 }
   *    }, 
   *   'idle', 'out', { duration: 0.5, ease: eases.expoIn }
   * ]);
   * ```
   *
   * In that example every property besides `position` and `alpha` will have a duration of one second
   * using the `eases.quadOut` ease equation. `position` will have a duration of 0.5 seconds and will
   * be delayed 0.5 seconds and will use the `eases.quadOut` easing function. `alpha` will simply have
   * a duration of 0.5 seconds.
   *
   * For advanced transitions you can pass in a function instead like so:
   * ```javascript
   * 
   * ui.transitions( [
   *   'out', 'idle', { 
   *     duration: 1, ease: eases.expoOut,
   *
   *     position: { duration: 0.5, delay: 0.5, ease: eases.quadOut },
   *     
   *     alpha: function(time, start, end) {
   *
   *        return (end - start) * time + start;
   *     }
   *    }, 
   *   'idle', 'out', { duration: 0.5, ease: eases.expoIn }
   * ]);
   * ```
   * 
   * There the animation is the same as in the previous example however `alpha` will be calculated using
   * a custom transition function.
   * 
   * @param  {Array} transitions An array which descriptes transitions
   * @chainable
   */
  transitions: function(transitions) {

    this.defTransitions = Array.isArray(transitions) ? transitions : arguments;

    return this;
  },

  /**
   * `f1` can target many different platforms. How it does this is by learning
   * how to parse defined states properties and applying it items you'd like
   * to animate.
   *
   * An Array of functions or multiple functions can be passes to `f1` each function
   * will read data from the state and apply it to the object being animated.
   *
   * An example function that sets the left position of a dom element might look like
   * this:
   * ```javascript
   * function setLeft(item, data) {
   * 
   *  item.style.left = data.left + 'px';
   * }
   * ```
   * 
   * @param  {Array} an array of functions which will parse states and apply them to
   *                 objects which are being animated.
   * @chainable
   */
  parsers: function() {

    var parseMethods = Array.prototype.slice.call(arguments);

    this.parser = this.parser || new f1Parser();

    // if it's an array of parsers
    if(Array.isArray(arguments[ 0 ])) {

      parseMethods = arguments[ 0 ];
    }

    parseMethods.forEach(function(parser) {

      this.parser.parsers(parser);
    }.bind(this));

    return this;
  },

  /**
   * Initializes `f1`. `init` will throw errors if required parameters such as
   * states and transitions are missing. The initial state for the `f1` instance
   * should be passed in.
   * 
   * @param  {String} Initial state for the `f1` instance
   * @chainable
   */
  init: function(initState) {

    var driver = this.driver;

    if(!this.defStates) {

      throw new Error('You must define states before attempting to call init');
    } else if(!this.defTransitions) {

      throw new Error('You must define transitions before attempting to call init');
    } else {

      parseStates(driver, this.defStates);
      parseTransitions(driver, this.defStates, this.defTransitions);

      driver.init(initState);
    }

    if(global.__f1__) {
      global.__f1__.init(this);
    } 

    return this;
  },

  /**
   * Destroys an `f1` instances. This should be called when you don't need the f1 instance anymore.
   */
  destroy: function() {

    if(global.__f1__) {
      global.__f1__.destroy(this);
    } 

    // TODO: make sure kimi gets destroyed and everything else that's needed
  },

  /**
   * Will tell `f1` to go to another state. Calling `go` will cause `f1` to calculate a path defined
   * through transitions to the state which was passed to it.
   * 
   * @param  {String} state The new state you'd like to go to
   * @param {Function} [cb] An optional callback which will be called once f1 reaches the state
   * @chainable
   */
  go: function(state, cb) {

    this.driver.go(state, cb);

    return this;
  },

  /**
   * Will force `f1` to update. This is useful if you're updating a states values lets say by mouse movement.
   * You'd call `f1.update` to ensure the state gets applied.
   *
   * @chainable
   */
  update: function() {

    _onUpdate.call(this, this.data, this.state, this.time);

    return this;
  },

  /**
   * An advanced method where you can apply the current state f1
   * has calculated to any object.
   *
   * Basically allows you to have one f1 object control multiple objects
   * or manually apply animations to objects.
   * 
   * @param  {String} animatablePath A path in the current state to the object you'd like to apply. The path should
   *                                 be defined using dot notation. So if your state had an object named `thing` and it
   *                                 contained another object you'd like to apply called `data`. Your `animatablePath`
   *                                 would be `'thing.data'`
   * @param  {Object} animatable The object you'd like to apply the currently calculated state to. For instance animatable
   *                             could be an html element.
   * @param  {Array} [parseFunctions] An optional array of functions which will pull data from the current state and apply
   *                                  it to the `animatable` object.
   */
  apply: function(animatablePath, animatable, parseFunctions) {

    var data = this.data,
        parser = this.parser,
        animationData;

    // if parse functions were passed in then create a new parser
    if(parseFunctions) {

      parser = new f1Parser(parseFunctions);
    }

    // if we have a parser then apply the parsers (parsers set css etc)
    if(parser) {

      if(typeof animatablePath == 'string') {

        animatablePath = animatablePath.split('.');
      }

      animationData = data[ animatablePath[ 0 ] ];

      for(var i = 1, len = animatablePath.length; i < len; i++) {

        animationData = animationData[ animatablePath[ i ] ];
      }

      parser.parse(animatable, animationData);
    }
  }
});

function getEventArgs(name, args) {

  args = Array.prototype.slice.apply(args);

  args.unshift(name);

  return args;
}

function _onUpdate(data, state, time) {

  var animatablePath, animatable;

  if(data !== undefined && state !== undefined && time !== undefined) {

    this.data = data;
    this.state = state;
    this.time = time;

    if(this.animatables) {

      for(var i = 0, len = this.animatables.length; i < len; i += 2) {

        animatablePath = this.animatables[ i ];
        animatable = this.animatables[ i + 1 ];

        this.apply(animatablePath, animatable);
      }
    }

    this.onUpdate(data, state, time);
  }
}

function _onState(data, state) {

  this.data = data;
  this.state = state;
  this.time = 0;

  this.onState(data, state);
}