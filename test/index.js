var ui = require( './..' );

var btn = ui();

btn.states( require( './states' ) );

btn.transitions( 

  'pre', 'idle', { duration: 1 },

  'idle', 'rollOver', {
    bg: { 
      x: { duration: 0.5, delay: 0 },
      y: { duration: 0.5, delay: 0.1 }
    }
  },

  'rollOver', 'idle', {
    bg: { duration: 0.5 }
  },

  'idle', 'post'
);

btn.init( 'pre' );

btn.go( 'rollOver' );



// hookup( {

//   mouseover: 'rollOver',
//   mouseout: 'idle'
// });