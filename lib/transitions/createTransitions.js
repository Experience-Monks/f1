var tweenFunction = require('tween-function');
var defaultTransition = require('./defaultTransition');

var assign = require('lodash/object/assign');


// uiDuration is the calculated overall duration for the ui
module.exports = function createTransitions(uiDuration, animation, stateFrom, stateTo) {

  // transition will be an object with all properties changed to be a function that can
  // interpolate between values
  var transition = {};
  var defaultDuration = animation.duration !== undefined ? animation.duration : defaultTransition.duration;
  var defaultDelay = animation.delay !== undefined ? animation.delay : defaultTransition.delay;
  var defaultEase = animation.ease || defaultTransition.ease;
  var duration;
  var delay;
  var ease;
  var animationUI;
  var animationProperty;
  var animationPropertyComponent;
  var tweenDefinition;

  // now loop through each ui in animation and create a tween-function
  for(var uiName in stateFrom) {

    // add the ui to the transition
    transition[ uiName ] = {};

    // set it to the overall animations defaults
    duration = defaultDuration;
    delay = defaultDelay;
    ease = defaultEase;

    // only if both states contain the ui then we'll create a transition
    if(stateTo[ uiName ]) {

      // update to be the ui elements values
      animationUI = animation[ uiName ] || {};
      duration = animationUI.duration || duration;
      delay = animationUI.delay || delay;
      ease = animationUI.ease || ease;  
      
      for(var propertyName in stateTo[ uiName ]) {
        tweenDefinition = {};

        animationProperty = getAnimationDefinition(animation[ propertyName ], duration, delay, ease);
        
        if(typeof stateFrom[ uiName ][ propertyName ] === 'object') {
          transition[ uiName ][ propertyName ] = {};

          for(var propertyComponentName in stateFrom[ uiName ][ propertyName ]) {

            animationPropertyComponent = getAnimationDefinition(
              animation[ uiName ] && animation[ propertyName ] && animation[ uiName ][ propertyName ][ propertyComponentName ],
              animationProperty.duration,
              animationProperty.delay,
              animationProperty.ease
            );

            tweenDefinition.duration = animationPropertyComponent.duration / uiDuration;
            tweenDefinition.delay = animationPropertyComponent.delay / uiDuration;
            tweenDefinition.ease = animationPropertyComponent.ease;
            tweenDefinition.cap = true;  

            transition[ uiName ][ propertyName ][ propertyComponentName ] = tweenFunction(tweenDefinition);
          }
        } else {
          tweenDefinition.duration = animationProperty.duration / uiDuration;
          tweenDefinition.delay = animationProperty.delay / uiDuration;
          tweenDefinition.ease = animationProperty.ease;
          tweenDefinition.cap = true;

          transition[ uiName ][ propertyName ] = tweenFunction(tweenDefinition);
        }
      }
    }
  }

  console.log(transition);

  return transition;
};

function getAnimationDefinition(animationDefinition, duration, delay, ease) {
  animationDefinition = animationDefinition || {};
  animationDefinition.duration = animationDefinition.duration === undefined ? duration : animationDefinition.duration;
  animationDefinition.delay = animationDefinition.delay === undefined ? delay : animationDefinition.delay;
  animationDefinition.ease = animationDefinition.ease || ease;

  return animationDefinition;
}


// module.exports = function createTransitions(transition, parentAnimationDuration, animationDefinition, stateFrom, stateTo, recurseDefault) {

//   var propertyDefinition;
//   var typeFrom;
//   var typeTo;

//   recurseDefault = recurseDefault || {};

//   if(animationDefinition) {
    
//     if(animationDefinition.duration !== undefined) {

//       recurseDefault.duration = animationDefinition.duration;
//     }

//     if(animationDefinition.delay !== undefined) {

//       recurseDefault.delay = animationDefinition.delay;
//     }

//     if(animationDefinition.ease !== undefined) {

//       recurseDefault.ease = animationDefinition.ease;
//     } 
//   } 

//   // evaluate creating tween functions
//   for(var i in stateFrom) {

//     typeFrom = typeof stateFrom[ i ];
//     typeTo = typeof stateTo[ i ];

//     if(typeTo == typeFrom) {

//       // if this definition is a function then just use it
//       if(animationDefinition && typeof animationDefinition[ i ] == 'function') {

//         transition[ i ] = animationDefinition[ i ];
//       // if both start and end state are numbers then we'll create an ease function
//       } else if(typeFrom == 'number') {

//         propertyDefinition = assign({}, recurseDefault, animationDefinition && animationDefinition[ i ]);

//         propertyDefinition.delay /= parentAnimationDuration;
//         propertyDefinition.duration /= parentAnimationDuration;
//         propertyDefinition.cap = true;

//         transition[ i ] = tweenFunction(propertyDefinition);
//       } else if(typeFrom != 'object') {

//         transition[ i ] = function(time, start, end) {

//           if(time < 1) {

//             return start;
//           } else {

//             return end;
//           }
//         };
//       } else {

//         transition[ i ] = {};
        
//         // create the defaultSettings which will be passed forward
//         recurseDefault = assign({}, defaultTransition, recurseDefault, animationDefinition && animationDefinition[ i ]);

//         createTransitions(transition[ i ], parentAnimationDuration, animationDefinition && animationDefinition[ i ], stateFrom[ i ], stateTo[ i ], recurseDefault);
//       }
//     } 
//   }
// };