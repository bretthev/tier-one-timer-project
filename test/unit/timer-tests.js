'use strict';
const assert = require('chai').assert;
const Timer = require('../../lib/scripts/timer-prototype');

describe('Timer', function() {
  it('Timer should be a function', function() {
    assert.isFunction(Timer);
  });
  it('should have default workTimerLength and breakTimerLength', function() {
    var timer = new Timer({});
    assert.equal(timer.workTimerLength, 1500000, timer.breakTimerLength, 3000000)
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

  it('should be able to generate a startWorkTime property', function() {
    var timer = new Timer({});
    timer.generateStartedWorkTime();
    assert.isDefined(timer.startedWorkTime)
  });

  it('should be able to calculate end work time', function() {
    debugger;
    var timer = new Timer({});
    timer.generateStartedWorkTime();
    timer.calculateEndOfWorkTime();
    assert.equal(timer.endWorkTime, timer.startedWorkTime + timer.workTimerLength)
  })
  it('should be able to change seconds into minutes and seconds', function () {
    var timer = new Timer({});
    var conversion = timer.changeSecondsToMinutesAndSeconds(115);
    assert.equal(conversion, '1 minute(s) and 55 seconds left.');
  })



  // it('should have a function to calculate end work time', function() {
  //   debugger;
  //   var timer = new Timer({});
  //   timer.calculateEndWorkTime();
  //   var endWorkTime = this.startedWorkTime + this.workTimerLength
  //   assert.equal(this.endWorkTime, endWorkTime)
  // })



});
