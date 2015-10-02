var getInterpolation = require('interpolation-builder');
var createTransitions = require('./createTransitions');

module.exports = function(driver, states, transitions) {

  // go through each transition and setup kimi with a function that works
  // with values between 0 and 1
  transitions.forEach( function(transition, i) {

    var from = transition.from || throwError('from', i, transition);
    var to = transition.to || throwError('to', i, transition);
    var animation = transition.animation || {};
    var animationDefinition = createTransitions(animation, states[ from ], states[ to ]);

    // else build the the transition
    if(typeof animation == 'object') {

      // this 
      animation = getInterpolation(
        animationDefinition.transitions
      );
    }

    // animation will either be a function passed in or generated from an object definition
    driver.fromTo(from, to, animationDefinition.duration, animation);
  });
};

function throwError(type, idx, transition) {

  throw new Error(
    'For the transition at ' + idx + ':\n' + 
    JSON.stringify(transition, unanimationined, '  ') + '\n' + 
    'you did not animationine ' + type + '\n\n'
  );
}