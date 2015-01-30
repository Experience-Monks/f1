module.exports = function( driver, states ) {

  var state, stateName;

  for( var stateName in states ) {

    state = states[ stateName ];

    driver.state( stateName, state );
  }
};