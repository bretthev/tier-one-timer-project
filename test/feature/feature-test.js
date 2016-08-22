const assert = require('assert');

describe('welcome page', function() {
  it('should grab page title', function() {
    browser.url('/');
    var title = browser.getTitle();
    assert.equal(title, 'Timer Project')
  })
})
