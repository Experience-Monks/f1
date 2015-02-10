var ui = require( './..' );

var btnEL = {};

var btn = ui( {

  onState: function( value, state ) {

    console.log( 'onState --> ', state, value );
  },

  onUpdate: function( value, state, time ) {

    console.log( 'btnEL:', btnEL );
  }
});

btn
.teach( function( item, data ) {

  item.x = data.position[ 0 ];
  item.y = data.position[ 1 ];
  item.alpha = data.alpha;
})
.states( require( './states' ) )
.transitions( 

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
)
.toAnimate( {

  bg: btnEL
})
.init( 'pre' )
.go( 'rollOver' );



// hookup( {

//   mouseover: 'rollOver',
//   mouseout: 'idle'
// });