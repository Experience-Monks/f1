module.exports = function( driver, states ) {

  var state, stateName;

  for( var stateName in states ) {

    state = states[ stateName ];

    // if the state is defined as a function
    // call the function and expect it to return a
    // state Object back
    if( typeof state == 'function' ) {

      state = states[ stateName ] = state( stateName );
    }

    driver.state( stateName, state );
  }
};