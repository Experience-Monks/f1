module.exports = function getParser() {

  var parsers = [];

  var renderer = {

    teach: function( property, parser ) {

      parsers.push( property, parser );
    },

    render: function( item, data ) {

      var cssProps, cssValue;

      for( var i = 0, len = parsers.length; i < len; i += 2 ) {


        if( Array.isArray( parsers[ i ] ) ) {

          cssValue = parsers[ i + 1 ]( data );

          parsers[ i ].forEach( function( cssProp ) {

            item[ cssProp ] = cssValue;
          });          
        } else {

          item[ parsers[ i ] ] = parsers[ i + 1 ]( data );
        }
      }
    }
  };

  return renderer;
};