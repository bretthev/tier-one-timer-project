const assert = require('assert');

describe('welcome page', function() {
  it('should grab page title', function() {
    browser.url('/');
    var title = browser.getTitle();
    assert.equal(title, 'Timer Project');
  });
});

describe('Pomodoro functionality on the DOM', function() {
  it('should have a time input and append time to the page', function() {
    browser.url('/');

    var timerLenghtInput = browser.element('.work-timer-length');

    timerLenghtInput.setValue('1');
    assert.equal(timerLenghtInput.getValue(), '1');
  });

  xit('should start time on the DOM based on the input entered by the user', function() {
    browser.element('.start-timer');

    var displayingTimerOnPage = browser.element('work-timer');

    assert.equal(displayingTimerOnPage.getValue(), '60');
  });

  it('should clear the input field after the start button is clicked', function() {
    var timerLenghtInput = browser.element('.work-timer-length');

    browser.buttonUp('.start-timer');
    timerLenghtInput.setValue('');

    assert.equal(timerLenghtInput.getValue(), '');
  });

  xit('should have a area for displaying the timer', function() {
    var displayingTimerOnPage = browser.element('work-timers');

    assert(displayingTimerOnPage.isExisting(), '');
  });

  it('should disable the pause button when the page first loads up', function() {
    browser.url('/');

    var pauseButtonStatus = browser.isEnabled('.pause-and-restart-timer');

    assert.equal(pauseButtonStatus, false);
  });

  it('should toggle the pause button to unpause if the timer is running', function() {

  });

});
