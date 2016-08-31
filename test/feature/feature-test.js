'use strict';

const assert = require('assert');

describe('welcome page', function() {
  it('should grab page title', function() {
    browser.url('/');
    var title = browser.getTitle();
    assert.equal(title, 'Timer Project');
  });
});

describe('Pomodoro functionality on the DOM', function() {
  it('should have a work-time input and append time to the page', function() {
    browser.url('/');

    // var worktimerLenghtInput = browser.element('.work-timer-length');

    worktimerLenghtInput.setValue('1');
    assert.equal(worktimerLenghtInput.getValue(), '1');
  });

  it('should have a break-time input', function() {
    var breaktimerLenghtInput = browser.element('.break-timer-length');

    breaktimerLenghtInput.setValue('1');
    assert.equal(breaktimerLenghtInput.getValue(), '1');
  });

  context('Buttons', function() {
    it('should have a start button', function() {
      browser.url('/');

      assert.equal(browser.isExisting('.start-timer'), true);
    });

    it('should have a pause button', function() {
      browser.url('/');

      assert.equal(browser.isExisting('.pause-timer'), true);
    });

    it('should have a resume button', function() {

      assert.equal(browser.isExisting('.resume-timer'), true);
    });

    it('should have a reset button', function() {

      assert.equal(browser.isExisting('.reset-timer'), true);
    });

    it('should have a change work time button', function() {
      browser.url('/');

      assert.equal(browser.isExisting('.change-work-time-button'), true);
    });

    it('should have a change break time button', function() {
      browser.url('/');

      assert.equal(browser.isExisting('.change-break-time-button'), true);
    });

    it('should have a clock icon button', function() {
      browser.url('/');

      assert.equal(browser.isExisting('.clock-icon'), true);
    });

    it('should have a beach ball button', function() {
      browser.url('/');

      assert.equal(browser.isExisting('.beach-icon'), true);
    });
  });

  it('should clear the input field after the start button is clicked', function() {
    var timerLenghtInput = browser.element('.work-timer-length');

    browser.buttonUp('.start-timer');

    assert.equal(('.').getValue(), '');
  });

  xit('should have a area for displaying the timer', function() {
    var displayingTimerOnPage = browser.element('work-timers');

    assert(displayingTimerOnPage.isExisting(), '');
  });

});
