var kimi = require( 'kimi' ),
    getTween = require( 'tween-function' ),
    _ = require( 'lodash' );

var parseStates = require( './lib/states/parseStates' ),
    parseTransitions = require( './lib/transitions/parseTransitions' );

module.exports = f1;

function f1( settings ) {

  if( !( this instanceof f1 ) ) {

    return new f1( settings );
  }

  settings = settings || {};

  this.defStates = null;
  this.defTransitions = null;

  this.driver = kimi( {

    onState: settings.onState,
    onUpdate: settings.onUpdate
  });
}

f1.prototype = {

  states: function( states ) {

    this.defStates = states;
  },

  transitions: function( transitions ) {

    this.defTransitions = _.isArray( transitions ) ? transitions : arguments;
  },

  init: function( initState ) {

    var driver = this.driver;

    parseStates( driver, this.defStates );
    parseTransitions( driver, this.defStates, this.defTransitions );

    driver.init( initState );
  },

  go: function( state ) {

    this.driver.go( state );
  }
};