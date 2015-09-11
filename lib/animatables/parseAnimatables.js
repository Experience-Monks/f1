module.exports = function(animatables) {

  var returnValue = [];

  // if it's an array we expect the data to be in correct format eg
  // [
  //  'outer.inner.item', DOMElement
  // ]
  if(Array.isArray( animatables )) {

    for(var i = 0, len = animatables.length; i < len; i += 2) {

      returnValue.push(animatables[ i ].split( '.' ));
      returnValue.push(animatables[ i + 1 ]);
    }
  // if it's not an array but an Object instead we will iterate
  // over each item and split the key by .
  } else {

    for(var i in animatables) {

      returnValue.push(i.split( '.' ), animatables[ i ]);
    }   
  }
  
  return returnValue;  
};