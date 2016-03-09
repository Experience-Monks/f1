var f1 = require('./../..');

// lets make a div we'll animate
// really this could be whatever an object 
// whatever you want
var itemToAnimate = document.body.appendChild(
  document.createElement('div')
);

// then we'll create the ui instance which will animate
// the div we crated
var ui = f1({
  // this will define what the targets are that will be animating
  // it will be associated in states
  targets: {
    item: itemToAnimate
  },
  // states defines what the div should look like in each state
  states: require('./states'),
  transitions: require('./transitions'),
  parsers: require('./parsers')
});

ui.init('out');
ui.go('idle');

itemToAnimate.addEventListener('mouseover', function() {
  ui.go('over');
});

itemToAnimate.addEventListener('mouseout', function() {
  ui.go('idle');
});

itemToAnimate.addEventListener('click', function() {
  ui.go('out');
});