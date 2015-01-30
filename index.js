var kimi = require( 'kimi' ),
    f1Parser = require( 'f1-parser' ),
    getTween = require( 'tween-function' ),
    _ = require( 'lodash' ),
    noop = require( 'no-op' );

var parseStates = require( './lib/states/parseStates' ),
    parseTransitions = require( './lib/transitions/parseTransitions' );

module.exports = f1;

function f1( settings ) {

  if( !( this instanceof f1 ) ) {

    return new f1( settings );
  }

  settings = settings || {};

  this.onState = settings.onState || noop;
  this.onUpdate = settings.onUpdate || noop;

  this.animatable = settings.toAnimate || null;
  this.defStates = settings.states || null;
  this.defTransitions = settings.transitions || null;
  this.parser = null;

  if( settings.parsers ) {

    this.teach( settings.parsers );
  }

  this.driver = kimi( {

    onState: onState.bind( this ),
    onUpdate: onUpdate.bind( this )
  });
}

f1.prototype = {

  toAnimate: function( animatable ) {

    this.animatable = animatable;

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
  }
};

function onUpdate( data, state, time ) {

  if( this.parser && this.animatable ) {

    if( Array.isArray( this.animatable ) ) {

      this.animatable.forEach( function( item ) {

        this.parser.parse( item, data );
      });
    } else {

      this.parser.parse( this.animatable, data );
    }
  }

  this.onUpdate( data, state, time );
}

function onState( data, state ) {

  this.onState( data, state );
}