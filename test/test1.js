var linear = require('./linear');

module.exports = {

  transitions: [
    {
      from: 'a',
      to: 'b',
      animation: { duration: 0.25, ease: linear }
    },
    {
      from: 'b',
      to: 'c',
      animation: { duration: 0.3, ease: linear }
    }
  ],

  states: {

    a: {
      item: {
        value: -34.333
      }
    },

    b: {
      item: {
        value: 260.5
      }
      
    },

    c: {
      item: {
        value: 540.3
      }
    }
  } 
};