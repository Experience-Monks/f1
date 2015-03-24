var linear = require('./linear');

module.exports = {

  transitions: [

    'a', 'b', { duration: 0.25, ease: linear },
    'b', 'c', { duration: 0.3, ease: linear }
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