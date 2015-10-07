module.exports = function getParser( parsers ) {

  var parserMethods = [];

  var parser = {

    parsers: function( parser ) {

      parserMethods.push( parser );
    },

    parse: function( item, data ) {

      parserMethods.forEach( function( method ) {

        method( item, data );
      });
    }
  };

  if( parsers ) {

    parsers.forEach( function( parserFunc ) {

      parser.parsers( parserFunc );
    });
  }

  return parser;
};