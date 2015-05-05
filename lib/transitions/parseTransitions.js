var getInterpolation = require( 'interpolation-builder' );

var createTransitions = require( './createTransitions' ),
    getTransitionDuration = require( './getTransitionDuration' );


module.exports = function( driver, states, transitions ) {

  var trans;
  var from;
  var to;
  var animation;
  var duration;


  transitions.forEach( function(transition, i) {

    trans = {};
    from = transition.from || throwError('from', i, transition);
    to = transition.to || throwError('to', i, transition);
    animation = transition.animation || {};

    // if the current animationinition is a function already then just use it
    if( typeof animation == 'function' ) {

      driver.fromTo( from, to, duration, animation );

    // else build the the transition
    } else {

      // transition, animation, stateFrom, stateTo
      duration = getTransitionDuration( animation, states[ from ], states[ to ] );

      createTransitions( trans, duration, animation, states[ from ], states[ to ] );

      driver.fromTo( from, to, duration, getInterpolation( trans ) );
    }
  });
};

function throwError(type, idx, transition) {

  throw new Error(
    'For the transition at ' + idx + ':\n' + 
    JSON.stringify(transition, unanimationined, '  ') + '\n' + 
    'you did not animationine ' + type + '\n\n'
  );
}