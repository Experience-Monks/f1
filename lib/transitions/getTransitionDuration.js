var tweenFunction = require( 'tween-function' ),
    _ = require( 'lodash' ),
    globalDefault = require( './defaultTransition' );



module.exports = function getTransitionDuration( def, stateFrom, stateTo, recurseDefault ) {

  var longestDuration = 0,
      defDefaults = {},
      hasDef = def !== undefined,
      recurseDefault, nDuration, cDef, typeFrom, typeTo;

  // create the recurseDefault which will be passed forward
  recurseDefault = _.assign( {}, globalDefault, recurseDefault, def );

  // evaluate creating tween functions
  for( var i in stateFrom ) {

    typeFrom = typeof stateFrom[ i ];
    typeTo = typeof stateTo[ i ];

    if( typeFrom == typeTo ) {

      // if both start and end state are numbers then we'll get a duration property
      if( typeFrom != 'object' ) {

        cDef = _.assign( {}, recurseDefault, def && def[ i ] );

        nDuration = cDef.duration + cDef.delay;
      } else {

        nDuration = getTransitionDuration( def && def[ i ], stateFrom[ i ], stateTo[ i ], recurseDefault );
      }

      longestDuration = getDuration( nDuration, longestDuration );
    }
  }

  return longestDuration;
};

function getDuration( duration, longestDuration ) {

  if( duration > longestDuration ) {

    return duration;
  } else {

    return longestDuration;
  }
}