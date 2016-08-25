function Timer(timerProperties) {
  this.workTimerLength = timerProperties.workTimerLength || 1500000;
  this.startedWorkTime = timerProperties.startedWorkTime;
  this.endWorkTime = timerProperties.endWorkTime;
  this.remainingWorkTime = timerProperties.remainingTime;
  // this.breakTimerLength = timerProperties.breakTimerLength || 300000;
  // this.startedBreakTime = timerProperties.startedBreakTime;
  // this.endBreakTime = timerProperties.endBreakTime;
  // this.remainingBreakTime = timerProperties.remainingBreakTime;
}

Timer.prototype.changeMillisecondsToSeconds = function(milliseconds) {
  return milliseconds / 1000;
}

Timer.prototype.changeSecondsToMilliseconds = function(seconds) {
  return seconds * 1000;
}

Timer.prototype.changeSecondsToMinutes = function(seconds) {
  if (seconds > 60) { return seconds / 60  }
  else { return seconds + ' seconds'};
}

Timer.prototype.changeMinutesToMilliseconds = function(minutes) {
  var seconds = minutes * 60;
  return seconds * 1000
};

Timer.prototype.changeMinutesToSeconds = function(minutes) {
  return minutes * 60;
}

Timer.prototype.changeMinutesToHours = function(minutes) {
  if (minutes > 60) { return minutes / 60 } ;
}

Timer.prototype.generateStartedWorkTime = function() {
  this.startedWorkTime = Date.now();
}

Timer.prototype.calculateEndOfWorkTime = function() {
  this.endWorkTime = this.startedWorkTime + this.workTimerLength;
}

Timer.prototype.calculateEndOfWorkTimeAfterBreak = function() {
  this.generateStartedWorkTime();
  this.endWorkTime = this.startedWorkTime + this.remainingWorkTime;
}

Timer.prototype.findRemainingWorkTime = function() {
  this.remainingWorkTime = this.endWorkTime - Date.now();
}

Timer.prototype.changeSecondsToEnglish = function(seconds) {
  leftOverSeconds = Math.floor(seconds % 60);
  minutes = Math.floor(seconds / 60);
  return `${minutes} minute(s) and ${leftOverSeconds} seconds left.`
}
// Timer.prototype.generateStartedBreakTime = function() {
//   this.startedBreakTime = Date.now();
// }
//
// Timer.prototype.calculateEndOfBreakTime = function() {
//   debugger;
//   this.generateStartedBreakTime();
//   this.endBreakTime = this.startedBreakTime + this.BreakTimerLength;
// }
//

// Timer.prototype.findRemainingBreakTime = function() {
//   this.remainingBreakTime = this.endBreakTime - this.startedBreakTime;
// }
//
// Timer.prototype.pauseWorkTimer = function() {
//   this.endWorkTime = Date.now();
// }
//
// Timer.prototype.restartWorkTimer = function() {
//   this.endWorkTime = this.endWorkTime + this.remainingWorkTime
// }

module.exports = Timer
