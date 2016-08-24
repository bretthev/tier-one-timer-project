const assert = require('chai').assert;
const Timer = require('../../lib/scripts/timer-prototype')

describe('Timer', function() {
  it('Timer should be a function', function() {
    assert.isFunction(Timer);
  });
});
