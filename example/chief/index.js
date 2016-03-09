var chief = require('../../chief');
var button = require('./button');

// we'll use this variable to keep track of the button we've selected previously
var selectedButton = null;

// the button function returns an object which will have two variables
// ui - an f1 instance
// el - a dom element we should append to the dom
var button1 = button({ text: 'Toronto', zIndex: 4 });
var button2 = button({ text: 'Helsinki', zIndex: 3 });
var button3 = button({ text: 'Vancouver', zIndex: 2 });
var button4 = button({ text: 'Seinäjoki', zIndex: 1 });

// the following events will add mouse events to all buttons
addMouseEvents(button1, 1);
addMouseEvents(button2, 2);
addMouseEvents(button3, 3);
addMouseEvents(button4, 4);

// add the elements to the body
document.body.appendChild(button1.el);
document.body.appendChild(button2.el);
document.body.appendChild(button3.el);
document.body.appendChild(button4.el);

// this will create our chief instance
var menu = chief({
  // here we define what f1 instances
  // this chief instance will target
  targets: {
    button1: button1.ui,
    button2: button2.ui,
    button3: button3.ui,
    button4: button4.ui
  },

  // here we'll define the states of the chief instance
  states: {

    // an out state
    // each value willd define what state
    // each ui instance should be in when we're in the
    // out state eg button1 should be in "out" when this
    // chief is in it's "out" state
    out: {
      button1: 'out',
      button2: 'out',
      button3: 'out',
      button4: 'out'
    },

    // an idle state
    idle: {
      button1: 'idle',
      button2: 'idle',
      button3: 'idle',
      button4: 'idle'
    },

    // a state when button1 is selected
    selected1: {
      button1: 'selected',
      button2: 'idle',
      button3: 'idle',
      button4: 'idle'
    },

    // a state when button2 is selected
    selected2: {
      button1: 'idle',
      button2: 'selected',
      button3: 'idle',
      button4: 'idle'
    },

    // a state when button3 is selected
    selected3: {
      button1: 'idle',
      button2: 'idle',
      button3: 'selected',
      button4: 'idle'
    },

    // a state when button4 is selected
    selected4: {
      button1: 'idle',
      button2: 'idle',
      button3: 'idle',
      button4: 'selected'
    }
  },

  // this will define the transitions of this chief instance
  // you cannot use durations or eases
  transitions: [
    // for out to idle we'll want to stagger animate in
    // the buttons
    { 
      from: 'out', to: 'idle', bi: true, animation: {
        button2: { delay: 0.3 },
        button3: { delay: 0.6 },
        button4: { delay: 0.9 }
      }
    },
    // to go from the selected states we'll want to go
    // back to the idle state and then go to the selected 
    // state
    { from: 'idle', to: 'selected1', bi: true },
    { from: 'idle', to: 'selected2', bi: true },
    { from: 'idle', to: 'selected3', bi: true },
    { from: 'idle', to: 'selected4', bi: true }
  ]
});

// initialize the chief instance
menu.init('out');

// animate the chief instance to the idle state
menu.go('idle', function() {
  console.log('is in idle');
});

function addMouseEvents(button, buttonNum) {

  // when we mouse over and out we'll animate individual
  // buttons if they are not selected
  button.el.addEventListener('mouseover', function() {
    if(selectedButton !== buttonNum) {
      button.ui.go('over');  
    }
  });

  button.el.addEventListener('mouseout', function() {
    if(selectedButton !== buttonNum) {
      button.ui.go('idle');  
    }
  });

  // when a button is selected we want to tell the menu
  // to animate to the proper selected state
  button.el.addEventListener('click', function() {
    selectedButton = buttonNum;
    page.go('selected' + buttonNum, function() {
      console.log('is in', 'selected' + buttonNum);
    });
  });
}