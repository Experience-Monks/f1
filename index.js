var kimi = require( 'kimi' ),
    f1Parser = require( 'f1-parser' ),
    getTween = require( 'tween-function' ),
    _ = require( 'lodash' ),
    noop = require( 'no-op' );

var parseStates = require( './lib/states/parseStates' ),
    parseTransitions = require( './lib/transitions/parseTransitions' ),
    parseAnimatables = require( './lib/animatables/parseAnimatables' );

module.exports = f1;

function f1( settings ) {

  if( !( this instanceof f1 ) ) {

    return new f1( settings );
  }

  settings = settings || {};

  this.onState = settings.onState || noop;
  this.onUpdate = settings.onUpdate || noop;

  this.data = null; // current animation data
  this.animatables = this.toAnimate( settings.toAnimate ) || null;
  this.defStates = settings.states || null;
  this.defTransitions = settings.transitions || null;
  this.parser = null;

  if( settings.teach ) {

    this.teach( settings.teach );
  }

  this.driver = kimi( {

    onState: _onState.bind( this ),
    onUpdate: _onUpdate.bind( this )
  });
}

f1.prototype = {

  toAnimate: function( animatables ) {

    this.animatables = parseAnimatables( animatables );

    return this;
  },

  states: function( states ) {

    this.defStates = states;

    return this;
  },

  transitions: function( transitions ) {

    this.defTransitions = _.isArray( transitions ) ? transitions : arguments;

    return this;
  },

  teach: function() {

    var parseMethods = Array.prototype.slice.call( arguments );

    this.parser = this.parser || new f1Parser();

    // if it's an array of parsers
    if( Array.isArray( arguments[ 0 ] ) ) {

      parseMethods = arguments[ 0 ];
    }

    parseMethods.forEach( function( parser ) {

      this.parser.teach( parser );
    }.bind( this ));

    return this;
  },

  init: function( initState ) {

    var driver = this.driver;

    parseStates( driver, this.defStates );
    parseTransitions( driver, this.defStates, this.defTransitions );

    driver.init( initState );

    return this;
  },

  go: function( state ) {

    this.driver.go( state );

    return this;
  },

  apply: function( animatablePath, animatable ) {

    var data = this.data,
        animationData;

    if( this.parser ) {

      if( typeof animatablePath == 'string' ) {

        animatablePath = animatablePath.split( '.' );
      }

      animationData = data[ animatablePath[ 0 ] ];

      for( var i = 1, len = animatablePath.length; i < len; i++ ) {

        animationData = animationData[ animatablePath[ i ] ];
      }

      this.parser.parse( animatable, animationData );
    }
  }
};

function _onUpdate( data, state, time ) {

  var animatablePath, animatable;

  this.data = data;
  this.state = state;
  this.time = time;

  if( this.animatables ) {

    for( var i = 0, len = this.animatables.length; i < len; i += 2 ) {

      animatablePath = this.animatables[ i ];
      animatable = this.animatables[ i + 1 ];

      this.apply( animatablePath, animatable );
    }
  }

  this.onUpdate( data, state, time );
}

function _onState( data, state ) {

  this.data = data;
  this.state = state;
  this.time = 0;

  this.onState( data, state );
}