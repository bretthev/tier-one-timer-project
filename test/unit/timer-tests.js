'use strict';
const assert = require('chai').assert;
const Timer = require('../../lib/scripts/timer-prototype');

describe('Timer', function() {
  it('Timer should be a function', function() {
    assert.isFunction(Timer);
  });
  it('should have default timerLength and nextTimerLength', function() {
    var timer = new Timer({});
    assert.equal(timer.timerLength, 1500000, timer.nextTimerLength, 2);
  });
});

describe('Timer functions', function() {
  it('should have a function for changing milliseconds to seconds', function() {
    var timer = new Timer({});
    var seconds = timer.changeMillisecondsToSeconds(3000);
    assert.equal(seconds, 3);
  });

  it('should have a function for changing seconds to Mlls', function() {
    var timer = new Timer({});
    var mlls = timer.changeSecondsToMilliseconds(3);
    assert.equal(mlls, 3000);
  });

  it('should have a function for changing seconds to minutes', function() {
    var timer = new Timer({});
    var mins = timer.changeSecondsToMinutes(300);
    assert.equal(mins, 5);
  });

  it('seconds to minutes function should return error message if given less than 60 seconds', function() {
    var timer = new Timer({});
    var mins = timer.changeSecondsToMinutes(58);
    assert.equal(mins, '58 seconds');
  });

  it('should have a function for changing minutes to Mlls', function() {
    var timer = new Timer({});
    var mlls = timer.changeMinutesToMilliseconds(2);
    assert.equal(mlls, 120000);
  });

  it('should have a function for changing minutes to hours', function() {
    var timer = new Timer({});
    var hours = timer.changeMinutesToHours(120);
    assert.equal(hours, 2);
  });

  it('should be able to generate a startTime property', function() {
    var timer = new Timer({});
    timer.generateStartedTime();
    assert.isDefined(timer.startedTime);
  });

  it('should be able to calculate end time', function() {
    var timer = new Timer({});
    timer.generateStartedTime();
    timer.calculateEndTime();
    assert.equal(timer.endTime, timer.startedTime + timer.timerLength);
  });

  it('should be able to change seconds into minutes and seconds', function () {
    var timer = new Timer({});
    var conversion = timer.changeSecondsToTime(115);
    assert.equal(conversion, '1:55');
  });

  it('should be able to check to see if time has expired', function() {
    var timer = new Timer({endTime: 20, nextTimerLength: 50})
    timer.checkForTimerEnd();
    assert.equal(timer.timerLength, 50);
  });

  it('should be able to send itself to localStorage', function() {
    var timer = new Timer({});
    timer.sendTimerToLocalStorage();
    var retrievedTimer = JSON.parse(localStorage.getItem('timer'));
    assert.equal(retrievedTimer.timerLength, timer.timerLength);
  });

  it('should be able to calculate remaining time', function() {
    var timer = new Timer({});
    timer.generateStartedTime();
    timer.calculateEndTime();
    var remaining = timer.findRemainingTime();
    assert.equal(timer.timeRemaining, 1500000)
  })

});
