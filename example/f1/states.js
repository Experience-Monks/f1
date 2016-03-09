// states is an object which defines what targets will look like in each
// state of the ui
module.exports = {
  // out is a state name
  // later we can say ui.go('out') to 
  // animate to the out state
  out: {
    // the following will define what the item
    // should look like in the out state
    item: {
      // x, y, and alpha are obviously not valid style properties
      // we define in parsers how this will be handled
      x: 200,
      y: -100,
      alpha: 0,
      text: ''  
    }
  },

  preIdle: {
    item: {
      x: 200,
      y: 100,
      alpha: 1,
      text: ''
    }
  },

  // idle is a state name
  idle: {
    // the following will define what the item
    // should look like in the idle state
    item: {
      x: 100,
      y: 100,
      alpha: 1,
      text: 'ROLL ME'
    }
  },

  // over is a state name
  over: {
    // the following will define what the item
    // should look like in the over state
    item: {
      x: 100,
      y: 105,
      alpha: 0.5,
      text: 'PRESS ME'
    }
  }
};