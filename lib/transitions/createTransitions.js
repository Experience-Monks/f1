var tweenFunction = require( 'tween-function' ),
    assign = require( 'lodash/object/assign' ),
    globalDefault = require( './defaultTransition' );



module.exports = function createTransitions( transition, transitionDuration, def, stateFrom, stateTo, recurseDefault ) {

  var propertyDefinition, typeFrom, typeTo;

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

    typeFrom = typeof stateFrom[ i ];
    typeTo = typeof stateTo[ i ];

    if( typeTo == typeFrom ) {

      // if this definition is a function then just use it
      if( def && typeof def[ i ] == 'function' ) {

        transition[ i ] = def[ i ];
      // if both start and end state are numbers then we'll create an ease function
      } else if( typeFrom == 'number' ) {

        propertyDefinition = assign( {}, recurseDefault, def && def[ i ] );

        propertyDefinition.delay /= transitionDuration;
        propertyDefinition.duration /= transitionDuration;
        propertyDefinition.cap = true;

        transition[ i ] = tweenFunction( propertyDefinition );
      } else if( typeFrom != 'object' ) {

        transition[ i ] = function( time, start, end ) {

          if( time < 1 ) {

            return start;
          } else {

            return end;
          }
        };
      } else {

        transition[ i ] = {};
        
        // create the defaultSettings which will be passed forward
        recurseDefault = assign( {}, globalDefault, recurseDefault, def && def[ i ] );

        createTransitions( transition[ i ], transitionDuration, def && def[ i ], stateFrom[ i ], stateTo[ i ], recurseDefault );
      }
    } 
  }
};