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

// this will initialize the ui instance in a state
// it will cause the parsers update functions to be run for the first time
ui.init('out');

// this will tell the ui to animate to the idle state
ui.go('idle');

// on mouse over we'll want to animate to the over state
itemToAnimate.addEventListener('mouseover', function() {
  ui.go('over');
});

// on mouse out we'll want to animate back to the idle state
itemToAnimate.addEventListener('mouseout', function() {
  ui.go('idle');
});

// on mouse click we'll want to animate out the button
itemToAnimate.addEventListener('click', function() {
  ui.go('out');
});