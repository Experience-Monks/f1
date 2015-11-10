var test = require('tape');

test('callback and events return same', require('./callbackAndUpdate'));
test('passing states, targets, transitions, parsers through constructor', require('./defineConstrutor'));
test('advanced animation', require('./advancedAnimation'));

// theres some issues with kimi step
// test('chief', require('./chief'));