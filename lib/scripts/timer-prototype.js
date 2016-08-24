function Timer(timerProperties) {
  this.workTimerLength = timerProperties.workTimerLength || 1500000;
  this.startedWorkTime = timerProperties.startedWorkTime;
  this.endWorkTime = timerProperties.endWorkTime;
  this.remainingWorkTime = timerProperties.remainingTime;
  this.breakTimerLength = timerProperties.breakTimerLength || 300000;
  this.startedBreakTime = timerProperties.startedBreakTime;
  this.endBreakTime = timerProperties.endBreakTime;
  this.remainingBreakTime = timerProperties.remainingBreakTime;
}

// Timer.prototype.changeMsToSeconds() = function (milliseconds){
//   return milliseconds * 1000;
// }
//
// Timer.prototype.changeSecondsToMlls() = function (seconds) {
//   return seconds / 1000;
// }
//
// Timer.prototype.changeSecsToMinutes() = function(seconds) {
//   if (seconds > 60) { return seconds / 60  } ;
// }
//
// Timer.prototype.changeMinutesToMilliseconds() = function(minutes) {
//   var seconds = minutes * 60;
//   return changeSecondsToMlls(seconds);
// }
//
// Timer.prototype.changeMinsToHours() = function(minutes) {
//   if (minutes > 60) { return mins / 60 } ;
// }
//
// Timer.prototype.calculateEndWorkTime() = function() {
//   var startWorkTime = Date.now();
//   this.startedWorkTime = startWorkTime;
//   this.endWorkTime = startWorkTime + this.workTimerLength;
// }
//
// Timer.prototype.calculateStopBreakTime() = function() {
//   var startBreakTime = Date.now();
//   this.startedBreakTime = startBreakTime;
//   this.endBreakTime = startBreakTime + this.breakTimerLength;
// }
//
// Timer.prototype.findRemainingWorkTime() = function() {
//   this.remainingWorkTime = this.endWorkTime - this.startedWorkTime;
// }
//
// Timer.prototype.findRemainingBreakTime() = function() {
//   this.remainingBreakTime = this.endBreakTime - this.startedBreakTime;
// }
//
// Timer.prototype.pauseWorkTimer() = function() {
//   this.endWorkTime = Date.now();
// }
//
// Timer.prototype.restartWorkTimer() = function() {
//   this.endWorkTime = this.endWorkTime + this.remainingWorkTime
// }

module.exports = Timer
