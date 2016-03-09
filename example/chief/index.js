var chief = require('../../chief');
var button = require('./button');

var selectedButton = null;
var button1 = button({ text: 'Toronto', zIndex: 4 });
var button2 = button({ text: 'Helsinki', zIndex: 3 });
var button3 = button({ text: 'Vancouver', zIndex: 2 });
var button4 = button({ text: 'Seinäjoki', zIndex: 1 });

addMouseEvents(button1, 1);
addMouseEvents(button2, 2);
addMouseEvents(button3, 3);
addMouseEvents(button4, 4);

document.body.appendChild(button1.el);
document.body.appendChild(button2.el);
document.body.appendChild(button3.el);
document.body.appendChild(button4.el);

var page = chief({
  targets: {
    button1: button1.ui,
    button2: button2.ui,
    button3: button3.ui,
    button4: button4.ui
  },

  states: {
    out: {
      button1: 'out',
      button2: 'out',
      button3: 'out',
      button4: 'out'
    },

    idle: {
      button1: 'idle',
      button2: 'idle',
      button3: 'idle',
      button4: 'idle'
    },

    selected1: {
      button1: 'selected',
      button2: 'idle',
      button3: 'idle',
      button4: 'idle'
    },

    selected2: {
      button1: 'idle',
      button2: 'selected',
      button3: 'idle',
      button4: 'idle'
    },

    selected3: {
      button1: 'idle',
      button2: 'idle',
      button3: 'selected',
      button4: 'idle'
    },

    selected4: {
      button1: 'idle',
      button2: 'idle',
      button3: 'idle',
      button4: 'selected'
    }
  },

  transitions: [
    { 
      from: 'out', to: 'idle', bi: true, animation: {
        button2: { delay: 0.3 },
        button3: { delay: 0.6 },
        button4: { delay: 0.9 }
      }
    },
    { from: 'idle', to: 'selected1', bi: true },
    { from: 'idle', to: 'selected2', bi: true },
    { from: 'idle', to: 'selected3', bi: true },
    { from: 'idle', to: 'selected4', bi: true }
  ]
});

page.init('out');
page.go('idle', function() {
  console.log('is in idle');
});

function addMouseEvents(button, buttonNum) {
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

  button.el.addEventListener('click', function() {
    selectedButton = buttonNum;
    page.go('selected' + buttonNum, function() {
      console.log('is in', 'selected' + buttonNum);
    });
  });
}