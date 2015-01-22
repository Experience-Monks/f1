var _ = require( 'lodash' );

module.exports = function( driver, states ) {

  _.forIn( states, function( state, stateName ) {

    driver.state( stateName, state );
  });
};