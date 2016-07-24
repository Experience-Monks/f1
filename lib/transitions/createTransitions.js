var tweenFunction = require('tween-function');
var defaultTransition = require('./defaultTransition');

module.exports = function createTransitions(animation, stateFrom, stateTo) {

  var paths = [];
  var pathAnimations;

  // paths will contain an array of arrays which will be paths to all properties to evaluate
  // we will pass both stateFrom and stateTo so that we can evaluate that both states contain
  // the prop to animate
  getPathsToProperties(stateFrom, stateTo, paths);

  // build animation definitions to each property using the path created above
  pathAnimations = paths.map(getAnimationDefinitions.bind(undefined, animation));

  return buildTransitionDefinition(paths, pathAnimations, stateFrom);
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

function getAnimationDefinitions(animation, path) {

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

  return reducedDefinition;
}

function buildTransitionDefinition(paths, pathAnimations, state) {
  var transitions = {};
  var overallDuration = pathAnimations.reduce( function(longestDuration, animationDef) {
    var curDuration = animationDef.duration + animationDef.delay;

    return curDuration > longestDuration ? curDuration : longestDuration;
  }, 0);
  var transitionsDef;
  var stateDef;
  var aniDef;

  // now create the transitions object
  paths.forEach( function(path, i) {
    var duration;
    var delay;
    var ease;

    transitionsDef = transitions;
    stateDef = state;
    aniDef = pathAnimations[ i ];

    duration = aniDef.duration;
    delay = aniDef.delay;
    ease = aniDef.ease;

    path.forEach( function(pathPart, j) {
      if(j === path.length - 1) {

        // Special consideration if animating percents
        if (typeof stateDef[ pathPart ] === 'string' && stateDef[ pathPart ].charAt(stateDef[ pathPart ].length-1)==='%') {
          transitionsDef[ pathPart ] = percentTweenFunction( {
            duration: duration / overallDuration,
            delay: delay / overallDuration,
            ease: ease,
            cap: true
          });

        // if the value is a number the transition will be built from tweenFunction
        } else if(typeof stateDef[ pathPart ] === 'number') {

          transitionsDef[ pathPart ] = tweenFunction( {
            duration: duration / overallDuration,
            delay: delay / overallDuration,
            ease: ease,
            cap: true
          });  
        // if the value is a String we'll need to use this transition function
        } else if(typeof stateDef[ pathPart ] === 'string' || typeof stateDef[ pathPart ] === 'boolean') {

          transitionsDef[ pathPart ] = function(time, start, end) {

            if(time * overallDuration < duration + delay) {

              return start;
            } else {

              return end;
            }
          };
        }
      } else {
        if(transitionsDef[ pathPart ] === undefined) {
          transitionsDef[ pathPart ] = {};
        }

        stateDef = stateDef[ pathPart ];
        transitionsDef = transitionsDef[ pathPart ];
      }
    });
  });

  return {
    duration: overallDuration,
    transitions: transitions
  };
}

function percentTweenFunction(obj) {
  var tween = tweenFunction(obj);
  return function(time,start,end) {
    return tween(time,parseFloat(start.slice(0,-1)),parseFloat(end.slice(0,-1)))+'%';
  }
};