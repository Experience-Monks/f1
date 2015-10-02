var getInterpolation = require('interpolation-builder');
var createTransitions = require('./createTransitions');
var getTransitionDuration = require('./getTransitionDuration');


module.exports = function(driver, states, transitions) {

  // go through each transition and setup kimi with a function that works
  // with values between 0 and 1
  transitions.forEach( function(transition, i) {

    var from = transition.from || throwError('from', i, transition);
    var to = transition.to || throwError('to', i, transition);
    var animation = transition.animation || {};
    var duration;

    // else build the the transition
    if(typeof animation == 'object') {

      // get the duration between from state and to state
      duration = getTransitionDuration(animation, states[ from ], states[ to ]);

      // this 
      animation = getInterpolation(
        createTransitions(duration, animation, states[ from ], states[ to ])
      );
    }

    // animation will either be a function passed in or generated from an object definition
    driver.fromTo(from, to, duration, animation);
  });
};

function throwError(type, idx, transition) {

  throw new Error(
    'For the transition at ' + idx + ':\n' + 
    JSON.stringify(transition, unanimationined, '  ') + '\n' + 
    'you did not animationine ' + type + '\n\n'
  );
}