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




## License

MIT, see [LICENSE.md](http://github.com/mikkoh/f1/blob/master/LICENSE.md) for details.
