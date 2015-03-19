var ui = require( './..' );

var btnEL = {};

var btn = ui( {

  onState: function( value, state ) {

    console.log( 'onState --> ', state, JSON.stringify( value ) );
  },

  onUpdate: function( value, state, time ) {

    console.log( 'onUpdate --> ', state, JSON.stringify( value ) );
  }
});

btn
.targets( function( item, data ) {

  item.x = data.position[ 0 ];
  item.y = data.position[ 1 ];
  item.alpha = data.alpha;
})
.states( require( './states' ) )
.transitions( 

  'pre', 'idle', { duration: 1 },

  'idle', 'rollOver', {
    bg: {

      position: function( time, start, end ) {

        return [ 333, 333 ];
      }
    }
  },

  'rollOver', 'idle', {
    bg: { duration: 0.5 }
  },

  'idle', 'post'
)
.parsers( {

  bg: btnEL
})
.init( 'pre' )
.go( 'rollOver' );



// hookup( {

//   mouseover: 'rollOver',
//   mouseout: 'idle'
// });