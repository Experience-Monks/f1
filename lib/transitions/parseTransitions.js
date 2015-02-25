var _ = require( 'lodash' ),
    getInterpolation = require( 'interpolation-builder' );

var createTransitions = require( './createTransitions' ),
    getTransitionDuration = require( './getTransitionDuration' );


module.exports = function( driver, states, transitions ) {

  var trans, from, to, def, duration;

  for( var i = 0, len = transitions.length; i < len;) {

    trans = {};
    from = transitions[ i ];
    to = transitions[ i + 1 ];
    def = transitions[ i + 2 ];

    if( _.isObject( def ) ) {

      i += 3;
    } else {

      i += 2;
      def = {};
    }

    // if the current definition is a function already then just use it
    if( typeof def == 'function' ) {

      driver.fromTo( from, to, duration, def );

    // else build the the transition
    } else {

      // transition, def, stateFrom, stateTo
      duration = getTransitionDuration( def, states[ from ], states[ to ] );

      createTransitions( trans, duration, def, states[ from ], states[ to ] );

      driver.fromTo( from, to, duration, getInterpolation( trans ) );
    }
  }
};