var kimi = require( 'kimi' ),
    getTween = require( 'tween-function' ),
    _ = require( 'lodash' );

var parseStates = require( './lib/states/parseStates' ),
    parseTransitions = require( './lib/transitions/parseTransitions' );

module.exports = ui;

function ui() {

  if( !( this instanceof ui ) ) {

    return new ui();
  }

  this.defStates = null;
  this.defTransitions = null;

  this.driver = kimi( {

    onState: onState.bind( this ),
    onUpdate: onUpdate.bind( this )
  });
}

ui.prototype = {

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

function onState( state, value ) {

  console.log( '---->', state, value );
}

function onUpdate( value, time ) {

  console.log( value, time );
}