var test = require( 'tape' );
var createTransitions = require( '../lib/transitions/createTransitions' );

var out = {};

var defTransition = { 

    duration: 10,
    x: {},
    sub: {

      x: { duration: 5 },
      y: {}
    }
};

var stateFrom = {

  x: 0,
  sub: {

    x: 0,
    y: 0,

    sub: {

      x: 0,
      y: 0
    }
  }
};

var stateTo = {

  x: 0,
  sub: {

    x: 0,
    y: 0,

    sub: {

      x: 0
    }
  }
};



test( 'create transtions', function( t ) {

  t.plan( 1 );

  var duration = createTransitions( out, defTransition, stateFrom, stateTo );

  t.equal( duration, 10, 'duration returned was correct' );
});

test( 'tween functions', function( t ) {

  t.plan( 3 );
  t.equal( out.x( 0, 5, 10 ), 5, 'x start value is correct' );
  t.equal( out.x( 5, 5, 10 ), 7.5, 'x mid value is correct' );
  t.equal( out.x( 10, 5, 10 ), 10, 'x end value is correct' );
});

test( 'sub tween functions', function( t ) {

  t.plan( 6 );
  t.equal( out.sub.x( 0, 5, 10 ), 5, 'sub.x start value is correct' );
  t.equal( out.sub.x( 2.5, 5, 10 ), 7.5, 'sub.x mid value is correct' );
  t.equal( out.sub.x( 5, 5, 10 ), 10, 'sub.x end value is correct' );

  t.equal( out.sub.y( 0, 5, 10 ), 5, 'sub.y start value is correct' );
  t.equal( out.sub.y( 5, 5, 10 ), 7.5, 'sub.y mid value is correct' );
  t.equal( out.sub.y( 10, 5, 10 ), 10, 'sub.y end value is correct' );
});

test( 'sub sub tween functions aka no definition' , function( t ) {

  t.plan( 3 );
  t.equal( out.x( 0, 5, 10 ), 5, 'x start value is correct' );
  t.equal( out.x( 5, 5, 10 ), 7.5, 'x mid value is correct' );
  t.equal( out.x( 10, 5, 10 ), 10, 'x end value is correct' );
});