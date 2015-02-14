var tweenFunction = require( 'tween-function' ),
    _ = require( 'lodash' ),
    globalDefault = require( './defaultTransition' );



module.exports = function createTransitions( transition, transitionDuration, def, stateFrom, stateTo, recurseDefault ) {

  var propertyDefinition;

  recurseDefault = recurseDefault || {};

  if( def ) {
    
    if( def.duration !== undefined ) {

      recurseDefault.duration = def.duration;
    }

    if( def.delay !== undefined ) {

      recurseDefault.delay = def.delay;
    }

    if( def.ease !== undefined ) {

      recurseDefault.ease = def.ease;
    } 
  } 

  // evaluate creating tween functions
  for( var i in stateFrom ) {

    // if both start and end state are numbers then we'll create an ease function
    if( _.isNumber( stateFrom[ i ] ) && _.isNumber( stateTo[ i ] ) ) {

      propertyDefinition = _.assign( {}, recurseDefault, def && def[ i ] );

      propertyDefinition.delay /= transitionDuration;
      propertyDefinition.duration /= transitionDuration;
      propertyDefinition.cap = true;

      transition[ i ] = tweenFunction( propertyDefinition );
    } else {

      transition[ i ] = {};
      
      // create the defaultSettings which will be passed forward
      recurseDefault = _.assign( {}, globalDefault, recurseDefault, def && def[ i ] );

      createTransitions( transition[ i ], transitionDuration, def && def[ i ], stateFrom[ i ], stateTo[ i ], recurseDefault );
    }
  }
};