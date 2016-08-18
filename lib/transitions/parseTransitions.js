var getInterpolation = require('interpolation-builder');
var createTransitions = require('./createTransitions');

module.exports = function(driver, states, transitions) {

  // go through each transition and setup kimi with a function that works
  // with values between 0 and 1
  transitions.forEach( function(transition, i) {

    var from = transition.from || throwError('from', i, transition);
    var to = transition.to || throwError('to', i, transition);
    var animation = transition.animation;
    var duration;
    var animationDefinition;

    // if animation is an object then it's a Tween like definition
    // otherwise we'll assume that animation is a function and we can simply
    // pass that to the driver
    if(typeof animation == 'object' || animation === undefined) {
      animation = animation || {};
      animationDefinition = createTransitions(animation, states[ from ], states[ to ], [from,to]);

      // this 
      animation = getInterpolation(
        animationDefinition.transitions
      );

      duration = animationDefinition.duration;
    } else {

      duration = animation.duration;
    }

    // animation will either be a function passed in or generated from an object definition
    driver.fromTo(from, to, duration, animation);

    // handle adding bi directional transitions
    if(transition.bi) {
      driver.fromTo(to, from, duration, animation);
    }
  });
};

function throwError(type, idx, transition) {

  throw new Error(
    'For the transition at ' + idx + ':\n' + 
    JSON.stringify(transition, undefined, '  ') + '\n' + 
    'you did not define ' + type + '\n\n'
  );
}