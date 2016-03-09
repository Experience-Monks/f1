# f1

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

F1 is a stateful ui library. F1 is the "core" for modules such as:
- [`f1-dom`](https://www.npmjs.com/f1-dom)
- [`react-f1`](https://www.npmjs.com/react-f1)

[![Chief Example Preview](images/chief-preview.gif)](https://github.com/Jam3/f1/tree/master/example/chief)

## Table Of Contents

- [Two parts of `f1`](#two-parts-of-f1)
  + [`f1`](#f1-1)
  + [`chief`](#chief)
- [Examples](#example)
  + [`f1`](#example-f1)
  + [`chief`](#example-chief)
- [API Documentation](#api-documentation)
  + [`var ui = f1()`](#var-ui--requiref1opts)
    * [`ui.targets(targets)`](#uitargetstargets)
    * [`ui.states(states)`](#uistatesstates)
    * [`ui.transitions(transitions)`](#uitransitionstransitions)
    * [`ui.parsers(parserDefinition)`](#uiparsersparserdefinition)
    * [`ui.init(initState)`](#uiinitinitstate)
    * [`ui.go(state, [cb])`](#uigostate-cb-1)
    * [`ui.update()`](#uiupdate)
  + [`var page = chief()`](#var-page--requiref1chiefopts)
    * [`page.targets(targets)`](#pagetargetstargets)
    * [`page.states(states)`](#pagestatesstates)
    * [`page.transitions(transitions)`](#pagetransitionstransitions)
    * [`page.init(initState)`](#pageinitinitstate)
    * [`page.go(state, [cb])`](#pagegostate-cb)


## Two parts of `f1`

There are two parts to this module `f1` and `chief`.

#### `f1`

Designed to build complete UI animations.

First define states/the look of the piece of ui. 

After designing the look you define transitions/animations for the piece of ui.

Since `f1` is designed to target many platforms you will also need to define parers which transfers the designed look to the target being animated.

#### `chief`

Designed to control `f1` ui instances. So let's assume you have a "page" of a site you can have `chief` control ui pieces's states by calling their `go` functions.


## Usage

[![NPM](https://nodei.co/npm/f1.png)](https://www.npmjs.com/package/f1)

### Example

There are two small examples for `f1` and `Chief`. They exist in the `example/`folder in the `f1` repo. You can run the examples locally via npm scripts.

Each example is commented to explain as much as possible and can be easily modified and played around with when running via npm scripts mentioned below.

### Example `f1`
[![F1 Example Preview](images/f1-preview.gif)](https://github.com/Jam3/f1/tree/master/example/f1)

```bash
$ npm run example-f1
```

[Source can be viewed here](https://github.com/Jam3/f1/tree/master/example/f1)

### Example `chief`
[![Chief Example Preview](images/chief-preview.gif)](https://github.com/Jam3/f1/tree/master/example/chief)

```bash
$ npm run example-chief
```

[Source can be viewed here](https://github.com/Jam3/f1/tree/master/example/f1)

## API Documentation

### `var ui = require('f1')([opts])`

To construct an `f1` instance you can pass in an optional settings object. The following are properties you can pass in settings:
```javascript
{
  // an object which contains all elements/items that you will be animating
  // eg. bgElement could be a <div> if working with the DOM
  targets: { 
    bg: bgElement 
  }, 

  // all states for the ui
  // states contain ui piece which "hook" up to targets
  // eg out.bg defines what targets.bg will look like in the out state
  states: { 
    out: {
      bg: { alpha: 0 } 
    },

    idle: {
      bg: { alpha: 1 }
    }
  },

  // an array which defines the transitions for the ui
  transitions: [
    // this ui can go from out to idle and idle to out
    { from: 'out', to: 'idle', bi: true} 
  ],

  // An Object contains init and update functions. These will be used
  // to initialize your ui elements and apply state to targets during update.
  // Parsers are defined to make `f1` work on any platform eg. React, DOM,
  // Canvas, SVG, Three.js, etc.
  // 
  // Above in states we define alpha this could be passed 
  // to the DOM's style.opacity for instance
  parsers: {
    init: [ initPosition ],
    update: [ applyPosition ]
  },

  // callback called whenever f1 reaches a state
  onState: listenerState, 

  // callback called whenever f1 is updating
  onUpdate: listenerUpdater 
}
```

### ui.targets(targets)

define which items are going to be animated. Pass in an object
which will look something like this:
```javascript
var ui = require('f1')();

ui.targets( {
  itemToAnimate1: find('#itemToAnimate1'),
  itemToAnimate2: find('#itemToAnimate2')
});
```
The `Object` being passed in should have variable names which will
associate to data which will be defined when setting up states in the
`ui.states` method. In this case `itemToAnimate1` and `itemToAnimate2` should be also defined in `ui.states`.

The values of the targets object can be for instance DOM elements if working with the DOM or Three.js `THREE.Mesh` if working with Three.js.




### `ui.states(states)`

defines the states which this `f1` instance will use.

States are defined as objects. It could look something like this:
```javascript
var ui = require('f1')();

ui.states( {

out: {
  itemToAnimate1: {
    variableToAnimate: 0
  },

  itemToAnimate2: {
    variableToAnimate: 0
  }
},

idle: {
  itemToAnimate1: {
    variableToAnimate: 1
  },

  itemToAnimate2: {
    variableToAnimate: 2
  }
}
});
```
Above two states would be created: `out` and `idle`. Both would animate two
objects: `itemToAnimate1` and `itemToAnimate2`. And in both of those objects
the property `variableToAnimate` is defined. So if we were to transition from
`out` to `idle` in `itemToAnimate1` `variableToAnimate` would transition from
0 to 1 and in `itemToAnimate2` from 0 to 2.

States can also be defined by passing in objects for instance the above could
be changed to look like this:
```javascript
var ui = require('f1')();

ui.states( {
  out: function(stateName) {
    console.log(stateName); // "out"

    return {
      itemToAnimate1: {
        variableToAnimate: 0
      },

      itemToAnimate2: {
        variableToAnimate: 0
      }
    };
  },

  idle: function(stateName) {
    console.log(stateName); // "idle"

    return {
      itemToAnimate1: {
        variableToAnimate: 1
      },

      itemToAnimate2: {
        variableToAnimate: 2
      }
    };
  }
});
```
The above can be handy when there are many items which states must be defined for instance a menu with many buttons.



### `ui.transitions(transitions)`

defines how this `f1` instance can animate between states. 

For instance if we had two states out and idle you could define your transitions like this:

```javascript
var ui = require('f1')();

ui.transitions( [
  { from: 'idle', to: 'rollOver', animation: { duration: 0.25 } },
  { from: 'rollOver', to: 'idle', animation: { duration: 0.1 } }
]);
```

Note that transitions are not bi-directional. If you'd like to create a bi-directional transition use `bi: true`:
```javascript
var ui = require('f1')();

ui.transitions( [
  { from: 'idle', to: 'rollOver', bi: true, animation: { duration: 0.25 } }
]);
```

If you simply just defined `from` and `to` and omitted the `animation` Object a default animation would be applied between states. This default transition will have a duration of 0.5 seconds and use a Linear ease.

If you want to modify the animation duration and ease you can define your transitions like this:

```javascript
var eases = require('eases');
var ui = require('f1')();

ui.transitions( [
  { 
    from: 'idle', 
    to: 'rollOver', 
    animation: { 
      duration: 0.25,
      ease: eases.quadOut
    } 
  },
  { 
    from: 'rollOver', 
    to: 'idle', 
    animation: { 
      duration: 0.1 
      ease: eases.expoOut
    } 
  }
]);
```

Defining your transitions using the above syntax will cause all properties to animate using the duration and ease defined. 

Ease functions should take a t or time value between 0-1 and return a modified time value between 0-1. Typically you might use the [`eases`](https://www.npmjs.com/eases) module.

You can also animate ui properties individually:
```javascript
var eases = require('eases');
var ui = require('f1')();

ui.transitions( [
  {
    from: 'out',
    to: 'idle',
    animation: { 
      duration: 1, ease: eases.expoOut,

      position: { duration: 0.5, delay: 0.5, ease: eases.quadOut },
      alpha: { duration: 0.5 }
    }
  },
  {
    from: 'idle',
    to: 'out',
    animation: { duration: 0.5, ease: eases.expoIn }
  }
]);
```

In the above example every property besides `position` and `alpha` will have a duration of one second using `eases.quadOut` ease. `position` will have a duration of 0.5 seconds and will be delayed 0.5 seconds and will use the `eases.quadOut` easing function. `alpha` will simply have a duration of 0.5 seconds.

For advanced transitions you can pass in a function instead like so:
```javascript

ui.transitions( [
  {
    from: 'out',
    to: 'idle',
    animation: { 
      duration: 1, ease: eases.expoOut,
      alpha: function(time, start, end) {
        return (end - start) * time + start;
      }
    }
  },
  {
    from: 'idle',
    to: 'out',
    animation: { duration: 0.5, ease: eases.expoIn }
  }
]);
```

The animation is the same as in the previous example however `alpha` will be calculated using a custom transition function.




### `ui.parsers(parserDefinition)`

`f1` can target many different platforms. How it does this is by using parsers which can target different platforms. Parsers apply calculated state objects to targets.

If working with the DOM for instance your state could define values which will be applied by the parser to the DOM elements style object. (see the `f1` example)

When calling parsers pass in an Object that can contain variables `init`, and `update`. Both should contain Array's of functions which will be used to either init or update ui.

`init` functions will receive: states definition, targets definition, and transitions definition. `init` will only be called once when the `f1` instance will inited.

Example:
```javascript
function initPosition(states, targets, transitions) {
  // usesPosition would check if the position property is used
  // by states if so initialize targets to be able to do something
  // with position
  if(usesPosition(states)) {
    // do whatever is needed to targets
    // if the position property is used
  }
}
```

`update` functions will receive: target and state. Where target could be for instance a dom element and state is the currently calculated state.

Example:
```javascript
function updatePosition(target, state) {
  target.style.left = state.position[ 0 ] + 'px';
  target.style.top = state.position[ 1 ] + 'px';
}
```

It should be noted that parsers can be called multiple times with different definitions and `init` and `update` functions will be merged.




### `ui.init(initState)`

Initializes `f1`. `init` will throw errors if required parameters such as
states, transitions, targets, and parsers are missing. The `initState` for the `f1` instance should be passed in as string.




### `ui.go(state, [cb])`

Will tell `f1` to animate to another state. Calling `go` will cause `f1` to calculate a path defined through transitions to the state which was passed to it.

An optional callback can be passed which is called once `f1` has reached that state.




### `ui.go(state, [cb])`

Will tell `f1` to immediately jump to another state. If an animation is in progress that animation is stopped immediately.




### `ui.update()`

Will force `f1` to update. This is useful if updating a state values dynamically by mouse movement or using some other method.

Call `ui.update` to ensure the state gets applied through `parsers` to `targets`.



### `var page = require('f1/chief')([opts])`

`chief` is designed to control `f1` instances so it's ideal for creating "pages" or ui components which merge many other ui components.

`require('f1/chief')` is a function that you can optionally pass options/settings to. It should be noted that all options have an associated function. You can pass in the following:

```javascript
{
  // ui and chief instances this chief instance will control
  // it should be noted that one chief instance can 
  // control another chief instance
  targets: {
    ui1: f1Instance,
    ui2: f1Instance,
    ui3: chiefInstance,
  },
  
  // define the states in which all above ui instances per state
  states: {
    out: {
      ui1: 'out',
      ui2: 'out',
      ui3: 'out'
    },

    idle: {
      ui1: 'idle',
      ui2: 'idle',
      ui3: 'idle'
    }
  },
  
  // defines transitions between chief's states
  // it should be noted you can apply delay's when defining
  // animations.
  transitions: [
    { 
      from: 'out', to: 'idle', bi: true, animation: {
        ui3: { delay: 0.5 }
      }
    }
  ]
}
```




### `page.targets(targets)`

`targets` is an Object that will define what ui/`f1` instances `chief` will control. It should be noted that chiefs can control other chiefs.

The `targets` arguments might look like this:
```javascript
targets: {
  ui1: f1Instance,
  ui2: f1Instance,
  ui3: chiefInstance,
}
```

### `page.states(states)`

`states` is an Object that will define what state the associated targets should be in as the `chief` instance changes states.

An example `states` arguments:
```javascript
states: {
  out: {
    ui1: 'out',
    ui2: 'out',
    ui3: 'out'
  },

  idle: {
    ui1: 'idle',
    ui2: 'idle',
    ui3: 'idle'
  }
}
```



### `page.transitions(transitions)`

`transitions` is an Array that will define how chief will be abe to traverse/navigate through states.

Example `transitions` argument:
```
[
  { 
    from: 'out', to: 'idle', bi: true, animation: {
      ui3: { delay: 0.5 }
    }
  }
]
```



### `page.init(initState)`

`init` will simply initialize chief to be in a state.



### `page.go(state, [cb])`

`go` will tell chief to animate to a state.


## License

MIT, see [LICENSE.md](http://github.com/mikkoh/f1/blob/master/LICENSE.md) for details.
