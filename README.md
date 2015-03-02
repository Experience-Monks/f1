# f1

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A stateful ui library

## Usage

[![NPM](https://nodei.co/npm/f1.png)](https://www.npmjs.com/package/f1)

### Example

Using `f1` in the dom:
```javascript
var f1 = require( 'f1' );
var find = require( 'dom-select' );
var eases = require( 'eases' );

var ui = new f1();
var container;

ui
// this will tell f1 what it should be animating. `item`
// will be used when defining states
.toAnimate( {

  item: find( '#bg' )
})
// this will tell f1 what item should look like in each state
.states( {
  
  out: {

    item: {

      alpha: 0, // opacity
      position: [ 0, -100, 0 ] // transform x, y, z
    }
  },

  idle: {

    item: {

      alpha: 1, // opacity
      position: [ 0, 0, 0 ] // transform x, y, z
    }
  },

  rollover: {

    item: {

      alpha: 0.5, // opacity
      position: [ -50, 0, 0 ] // transform x, y, z
    }
  }
})
// the following defines how f1 can move from state to state
.transitions( [ 
  'out', 'idle', { duration: 3 },
  'idle', 'rollover', { duration: 0.5, ease: eases.expoOut },
  'rollover', 'idle', { duration: 0.25, ease: eases.expoIn }
])
// teaches f1 how to handle `item` since `item` is a dom element we'll teach this f1
// instance how to handle dom elements
.teach( require( 'f1-dom' ) )
// tell f1 what should be the initial state
.init( 'out' );

// this will tell f1 to animate to the idle state from the initial state (out)
ui.go( 'idle' );


// the following will just add mouse events to a container
// which contains #item
container = find( '#container' ); // contains the item

container.addEventListener( 'mouseenter', function() {

  // the following will tell f1 that it should go to the rollover state
  ui.go( 'rollover' );
});

el.addEventListener( 'mouseleave', function() {
  
  // the following will tell f1 that it should go to the idle state
  ui.go( 'idle' );
});
```

## API 

### Constructor
```javascript
ui = f1( [ settigns ] );
```
or 
```javascript
ui = new f1( [ settings ] );
```

To construct an `f1` instance you can pass in an optional settings object. The following are properties you can pass in settings:
```javascript
{
  onState: listenerState, // this callback will be called whenever f1 reaches a state
  onUpdate: listenerUpdater, // this callback will be called whenever f1 is updating
  
  // this is an object which contains all elements/items that you will be animating
  toAnimate: { 
    bg: bgElement 
  }, 

  // all states for the ui
  // states are the top level object and anything after that are the properties 
  // for that state
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
    'out', 'idle', // this ui can go from out to idle
    'idle', 'out' // and idle to out
  ],

  // an array of functions which will be able to take values
  // from a state define in states and apply it to the 
  // items defined in toAnimate
  teach: [ applyAlpha ]
}
```

### f1.toAnimate( targets )

define which items are going to be animated. Pass in an object
which will look something like this:
```javascript
var ui = require( 'f1' )();

ui.toAnimate( {

 itemToAnimate1: find( '#itemToAnimate1' ),
 itemToAnimate2: find( '#itemToAnimate2' )
});
```
The `Object` being passed in should have variable names which will
associate to data which will be defined when setting up states in the
`f1.states` method. The value which you pass these can be anything.

### `f1.states( states )`

 defines the states which this `f1` instance will use.

 States are defined as objects. It could look something like this:
 ```javascript
 var ui = require( 'f1' )();
 
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
 var ui = require( 'f1' )();
 
 ui.states( {

  out: function( stateName ) {

    console.log( stateName ); // "out"
 
    return {
      itemToAnimate1: {
        variableToAnimate: 0
      },
  
      itemToAnimate2: {
        variableToAnimate: 0
      }
    };
  },

  idle: function( stateName ) {

    console.log( stateName ); // "idle"
 
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
 The above can be handy when there are many items which states must be defined for
 instance a menu with many buttons.



### `f1.transitions( transitions )`

 defines how this `f1` instance can move between states. 

 For instance if we had two states out and idle you could define your transitions
 like this:

 ```javascript
 var ui = require( 'f1' )();
 
 ui.transitions( [
   'out', 'idle', // defines that you can go from the out state to the idle state
   'idle', 'out' // defines that you can go from the idle state to the out state
 ]);
 ```

 Note that transitions are not bi-directional.

 If you simply just defined state names a default animation would be applied between
 states. This default transition will have a duration of 0.5 seconds and use no ease.

 If you want to modify the animation duration and ease you can define your transitions
 like this:

 ```javascript
 var eases = require( 'eases' );
 var ui = require( 'f1' )();
 
 ui.transitions( [
   'out', 'idle', { duration: 1, ease: eases.expoOut }, 
   'idle', 'out', { duration: 0.5, ease: eases.expoIn }
 ]);
 ```

 Defining your transitions using the above syntax will cause all properties to animate
 using the duration and ease defined. 

 Ease functions should take a time property between 0-1 and return a modified value between
 0-1.
 
 You can also animate properties individually. Here passing a delay maybe sometimes 
 userful:
 
 ```javascript
 var eases = require( 'eases' );
 var ui = require( 'f1' )();
 
 ui.transitions( [
   'out', 'idle', { 
     duration: 1, ease: eases.expoOut,

     position: { duration: 0.5, delay: 0.5, ease: eases.quadOut },
     alpha: { duration: 0.5 }
    }, 
   'idle', 'out', { duration: 0.5, ease: eases.expoIn }
 ]);
 ```

 In that example every property besides `position` and `alpha` will have a duration of one second
 using the `eases.quadOut` ease equation. `position` will have a duration of 0.5 seconds and will
 be delayed 0.5 seconds and will use the `eases.quadOut` easing function. `alpha` will simply have
 a duration of 0.5 seconds.

 For advanced transitions you can pass in a function instead like so:
 ```javascript
 
 ui.transitions( [
   'out', 'idle', { 
     duration: 1, ease: eases.expoOut,

     position: { duration: 0.5, delay: 0.5, ease: eases.quadOut },
     
     alpha: function( time, start, end ) {

        return ( end - start ) * time + start;
     }
    }, 
   'idle', 'out', { duration: 0.5, ease: eases.expoIn }
 ]);
 ```
 
 There the animation is the same as in the previous example however `alpha` will be calculated using
 a custom transition function.

### `f1.teach( parseMethods )`

 `f1` can target many different platforms. How it does this is by learning
 how to parse defined states properties and applying it items you'd like
 to animate.

 An Array of functions or multiple functions can be passes to `f1` each function
 will read data from the state and apply it to the object being animated.

 An example function that sets the left position of a dom element might look like
 this:
 ```javascript
 function setLeft( item, data ) {
 
  item.style.left = data.left + 'px';
 }
 ```


### `f1.init( initState )`

 Initializes `f1`. `init` will throw errors if required parameters such as
 states and transitions are missing. The initial state for the `f1` instance
 should be passed in.

### `f1.go( state )`

 Will tell `f1` to go to another state. Calling `go` will cause `f1` to calculate a path defined
 through transitions to the state which was passed to it.

### `f1.update()`

 Will force `f1` to update. This is useful if you're updating a states values lets say by mouse movement.
 You'd call `f1.update` to ensure the state gets applied.



## License

MIT, see [LICENSE.md](http://github.com/mikkoh/f1/blob/master/LICENSE.md) for details.
