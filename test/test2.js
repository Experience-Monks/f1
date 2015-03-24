var linear = require('./linear');

module.exports = {

  transitions: [

    'a', 'b', { duration: 0.25, ease: linear },
    'b', 'c', { duration: 0.3, ease: linear }
  ],

  states: {

    a: function() {

      return {
        item: {
          value: 0
        }
      };
    },

    b: function() {

      return {
        item: {
          value: 260.5
        }
      };
    },

    c: function() {

      return {
        item: {
          value: 540.3
        }
      };
    },
  } 
};