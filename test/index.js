var f1 = require( './..' );
var test = require('tape');
var rightNow = require('right-now');

test('animating basic values', function(t) {

  var test1 = require('./test1');
  var testData = [];
  var timeStart = rightNow();

  var item = {};
  var onStateExpectedValue = [-34.333, 260.5, 260.5, 540.3];
  var onStateItemValues = [];
  var onStateDataValues = [];
  var calledOnUpdate = false;

  var time;

  f1( {
    onState: function(data, state) {
      onStateDataValues.push(data.item.value);
      onStateItemValues.push(item.value);
    },

    onUpdate: function(data, state, time) {
      calledOnUpdate = true;
    }
  })
  .states(test1.states)
  .transitions(test1.transitions)
  .targets({ item: item })
  .parsers([
    function( item, data ) {

      for( var i in data ) {
        item[ i ] = data[ i ];
      }
    }
  ])
  .init( 'a' )
  .go( 'c', function() {

    t.ok(calledOnUpdate, 'did onUpdate');
    t.deepEqual(onStateItemValues, onStateDataValues, 'data and item were always the same onState update');
    t.deepEqual(onStateItemValues, onStateExpectedValue, 'expected values for state updates were correct');

    t.end();
  });
});




test('animating generated states', function(t) {

  var test1 = require('./test2');
  var testData = [];
  var timeStart = rightNow();

  var item = {};
  var onStateState = [];
  var onStateStatExpected = ["a", "b", "b", "c"];
  var onStateExpectedValue = [0, 260.5, 260.5, 540.3];
  var onStateItemValues = [];
  var onStateDataValues = [];
  var calledOnUpdate = false;

  var time;

  f1( {
    onState: function(data, state) {
      onStateDataValues.push(data.item.value);
      onStateItemValues.push(item.value);

      onStateState.push(state);
    },

    onUpdate: function(data, state, time) {
      calledOnUpdate = true;
    }
  })
  .states(test1.states)
  .transitions(test1.transitions)
  .targets({ item: item })
  .parsers([
    function( item, data ) {

      for( var i in data ) {
        item[ i ] = data[ i ];
      }
    }
  ])
  .init( 'a' )
  .go( 'c', function() {

    t.deepEqual(onStateState, onStateStatExpected, 'ran through states in order');
    t.ok(calledOnUpdate, 'did onUpdate');
    t.deepEqual(onStateItemValues, onStateDataValues, 'data and item were always the same onState update');
    t.deepEqual(onStateItemValues, onStateExpectedValue, 'expected values for state updates were correct');

    t.end();
  });
});