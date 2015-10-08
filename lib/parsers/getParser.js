module.exports = function getParser(parserDefinition) {

  var initMethods = [];
  var parserMethods = [];

  var parser = {

    add: function(parserDefinition) {
      if(parserDefinition.init) {
        parserDefinition.init.forEach(function(initFunc) {
          parser.addInit(initFunc);
        });
      }

      if(parserDefinition.update) {
        parserDefinition.update.forEach(function(parserFunc) {
          parser.addUpdate(parserFunc);
        });
      }
    },

    addInit: function(init) {
      initMethods.push(init);
    },

    addUpdate: function(parser) {

      parserMethods.push(parser);
    },

    /**
     * This will be called when the `f1` instance is initialized.
     * 
     * @param  {Object} states      states the `f1` instance currently is using
     * @param  {Object} targets     targets the `f1` instance currently is using
     * @param  {Array} transitions transitions the `f1` instance currently is using
     */
    init: function(states, targets, transitions) {

      initMethods.forEach( function(method) {

        method(states, targets, transitions);
      });
    },

    /**
     * This will be called when `f1` has calculated state updates.
     * 
     * @param  {Object} item This will be an item defined in targets
     * @param  {Object} calculatedState current calculated state from f1
     */
    update: function(item, calculatedState) {

      parserMethods.forEach( function(method) {

        method(item, calculatedState);
      });
    }
  };

  // if a parserDefinition was passed then we want to add all to this parser
  if(parserDefinition) {
    parser.add(parserDefinition);
  }

  return parser;
};