'use strict';

function Timer(timerProperties) {
  this.workTimerLength = timerProperties.workTimerLength || 1500000;
  this.startedWorkTime = timerProperties.startedWorkTime;
  this.endWorkTime = timerProperties.endWorkTime;
  this.remainingWorkTime = timerProperties.remainingTime;
  this.timeLeftAtPause = timerProperties.timeLeftAtPause;
  this.currentState = timerProperties.currentState || 'new timer'
}

Timer.prototype.changeMillisecondsToSeconds = function(milliseconds) {
  return milliseconds / 1000;
};

Timer.prototype.changeSecondsToMilliseconds = function(seconds) {
  return seconds * 1000;
};

Timer.prototype.changeSecondsToMinutes = function(seconds) {
  if (seconds > 60) { return seconds / 60;  }
  else { return seconds + ' seconds'; }
};

Timer.prototype.changeMinutesToMilliseconds = function(minutes) {
  return minutes * 60000;
};

Timer.prototype.changeMinutesToSeconds = function(minutes) {
  return minutes * 60;
};

Timer.prototype.changeMinutesToHours = function(minutes) {
  if (minutes > 60) { return minutes / 60; }
};

Timer.prototype.generateStartedWorkTime = function() {
  this.startedWorkTime = Date.now();
};

Timer.prototype.calculateEndOfWorkTime = function() {
  this.endWorkTime = this.startedWorkTime + this.workTimerLength;
};

Timer.prototype.calculateEndOfWorkTimeAfterBreak = function() {
  this.generateStartedWorkTime();
  this.endWorkTime = this.startedWorkTime + this.timeLeftAtPause;
};

Timer.prototype.findRemainingWorkTime = function() {
  this.remainingWorkTime = this.endWorkTime - Date.now();
}

Timer.prototype.changeSecondsToTime = function(seconds) {
  var leftOverSeconds = Math.floor(seconds % 60);
  var minutes = Math.floor(seconds / 60);
  if (leftOverSeconds < 10) {return `${minutes}:0${leftOverSeconds}`}
  else {return `${minutes}:${leftOverSeconds}`
  }
}

module.exports = Timer;
