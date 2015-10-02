var tweenFunction = require('tween-function');
var defaultTransition = require('./defaultTransition');

module.exports = function createTransitions(uiDuration, animation, stateFrom, stateTo) {

  var transitions = {};
  var paths = [];

  // paths will contain an array of arrays which will be paths to all properties to evaluate
  // we will pass both stateFrom and stateTo so that we can evaluate that both states contain
  // the prop to animate
  getPathsToProperties(stateFrom, stateTo, paths);
    
  // now loop through the paths and build the animation definition
  // then create the transition object
  paths.forEach( function(path) {
    var animationDefinition = animation; 
    var reducedDefinition = path.reduce( function(curDef, pathPart) {

      animationDefinition = animationDefinition[ pathPart ] || {};

      return {
        duration: thisOrThat(animationDefinition.duration, curDef.duration),
        delay: thisOrThat(animationDefinition.delay, curDef.delay),
        ease: thisOrThat(animationDefinition.ease, curDef.ease)
      };
    }, { duration: animation.duration, delay: animation.delay, ease: animation.ease });

    // apply the defaults if no durations and delays and eases have been created
    reducedDefinition.duration = thisOrThat(reducedDefinition.duration, defaultTransition.duration);
    reducedDefinition.delay = thisOrThat(reducedDefinition.delay, defaultTransition.delay);
    reducedDefinition.ease = thisOrThat(reducedDefinition.ease, defaultTransition.ease);

    var transitionsDef = transitions;
    // now add the reducedDefinition to the transitions object
    path.forEach( function(pathPart, i) {

      // is the last item
      if(i === path.length - 1) {
        transitionsDef[ pathPart ] = tweenFunction( {
          duration: reducedDefinition.duration / uiDuration,
          delay: reducedDefinition.delay / uiDuration,
          ease: reducedDefinition.ease,
          cap: true
        });
      } else {
        if(!transitionsDef[ pathPart ]) {
          transitionsDef[ pathPart ] = {};
        }
      }
      
      transitionsDef = transitionsDef[ pathPart ];
    });
  });

  return transitions;
};

function thisOrThat(value1, value2)  {
  return value1 !== undefined ? value1 : value2;
}

function getPathsToProperties(stateFrom, stateTo, paths, keys) {

  var newKeys;

  keys = keys || [];

  for(var i in stateFrom) {

    // both states have this property
    if(stateTo[ i ] !== undefined) {

      newKeys = keys.slice();
      newKeys.push(i);

      if(typeof stateFrom[ i ] === 'object') {
      
        getPathsToProperties(stateFrom[ i ], stateTo[ i ], paths, newKeys);  
      } else {
        
        paths.push(newKeys);
      }
    }
  }
}