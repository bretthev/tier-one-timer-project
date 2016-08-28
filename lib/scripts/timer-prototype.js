'use strict';

function Timer(timerProperties) {
  this.timerLength = timerProperties.timerLength || 1500000;
  this.nextTimerLength = timerProperties.nextTimerLength || 300000;
  this.startedTime = timerProperties.startedTime;
  this.endTime = timerProperties.endTime;
  this.timeRemaining = timerProperties.timeRemaining;
  this.timeLeftAtPause = timerProperties.timeLeftAtPause;
  this.currentState = timerProperties.currentState || 'new timer';
  this.currentClass = timerProperties.currentClass || 'work timer';
  this.nextClass = timerProperties.nextClass = 'break timer';
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

Timer.prototype.generateStartedTime = function() {
  this.startedTime = Date.now();
};

Timer.prototype.calculateEndTime = function() {
  this.endTime = this.startedTime + this.timerLength;
};

Timer.prototype.calculateEndTimeAfterBreak = function() {
  this.generateStartedTime();
  this.endTime = this.startedTime + this.timeLeftAtPause;
};

Timer.prototype.findRemainingTime = function() {
  this.timeRemaining = this.endTime - Date.now();
};

Timer.prototype.changeSecondsToTime = function(seconds) {
  var leftOverSeconds = Math.floor(seconds % 60);
  var minutes = Math.floor(seconds / 60);
  if (leftOverSeconds < 10) {
    return `${minutes}:0${leftOverSeconds}`;
  } else {
    return `${minutes}:${leftOverSeconds}`;
  }
};

Timer.prototype.checkForTimerEnd = function() {
  var currentTimerLength = this.timerLength;
  var currentClass = this.currentClass;
  if (Date.now() > this.endTime){
    this.currentState = 'running';
    this.timerLength = this.nextTimerLength;
    this.currentClass = this.nextClass;
    this.nextTimerLength = currentTimerLength;
    this.nextClass = currentClass;
    this.generateStartedTime();
    this.calculateEndTime();
    this.findRemainingTime();
  }
};

Timer.prototype.sendTimerToLocalStorage = function() {
  localStorage.setItem('timer', JSON.stringify(this));
};

Timer.prototype.getTimerFromLocalStorage = function() {
  return JSON.parse(localStorage.getItem('timer'));
};

Timer.prototype.checkForLast20Seconds = function(sound) {
  if((this.timeRemaining < 21010 && this.timeRemaining > 20990)
  || (this.timeRemaining < 16010 && this.timeRemaining > 15990)
  || (this.timeRemaining < 11010 && this.timeRemaining > 10990)
  || (this.timeRemaining < 6010 && this.timeRemaining > 5990)) {
    console.log('fart noise')
    sound.play();
  }
};

module.exports = Timer;
