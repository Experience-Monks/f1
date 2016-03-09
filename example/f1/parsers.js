// parsers is an object which has two arrays init and update
// the main purpose of parsers is have the ability to apply
// animated properties to targets
module.exports = {

  // init is an array of functions that will be run once the 
  // f1 instance initializes
  // typically you'd drop code in here that is required to initialize
  // the targets to animate.
  // 
  // In this case we'll just give the item we want to animate a width, height
  // and add a background color so it can be seen
  init: [
    function(states, targets, transitions) {

      for(var i in targets) {
        var itemToAnimate = targets[ i ];

        itemToAnimate.style.position = 'absolute';
        itemToAnimate.style.backgroundColor = '#CAFE00';
        itemToAnimate.style.width = itemToAnimate.style.height = '100px';
      }
    }
  ],

  // update is an array of functions that will be run each time
  // the ui should be animated. It accepts the target and currently
  // calculated state.
  // 
  // In our case we will parse out the x, y, alpha properties and apply to
  // css style left, top, and opacity
  update: [
    function(target, state) {
      target.style.left = state.x + 'px';
      target.style.top = state.y + 'px';
      target.style.opacity = state.alpha;

      target.innerText = state.text;
    }
  ]
};